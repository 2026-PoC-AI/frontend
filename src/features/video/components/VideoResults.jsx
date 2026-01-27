import { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Play, Video } from "lucide-react";
import { useVideoStore } from "../../../store/videoStore";

import { VideoPlayer } from "./result/VideoPlayer";
import { FrameTimeline } from "./result/FrameTimeline";
import { SuspiciousFrameAnalysis } from "./result/SuspiciousFrameAnalysis";
import { ModelAnalysis } from "./result/ModelAnalysis"; 
import { ArtifactDetail } from "./result/ArtifactDetail";  

export function VideoResults() {
    const navigate = useNavigate();
    const location = useLocation();

    const { file, fileFromState, result: resultFromState } = location.state || {};

    const [videoUrl, setVideoUrl] = useState("");
    const [selectedFrameIndex, setSelectedFrameIndex] = useState(0);

    const {
        isPlaying,
        isMuted,
        currentTime,
        setIsPlaying,
        setIsMuted,
        setCurrentTime,
    } = useVideoStore();

    // ================= Video URL =================
    useEffect(() => {
        if (resultFromState?.analysisId) {
            const url = `http://localhost:8080/api/video/files/${resultFromState.analysisId}`;
            setVideoUrl(url);
        } else if (fileFromState) {
            const blobUrl = URL.createObjectURL(fileFromState);
            setVideoUrl(blobUrl);

            return () => URL.revokeObjectURL(blobUrl);
        }
    }, [resultFromState, fileFromState]);

    // ================= Result Mapping =================
    const results = useMemo(() => {
        if (!resultFromState) return null;

        const analysisResult = resultFromState.analysisResult || {};
        const videoFile = resultFromState.videoFile || {};
        const frameAnalyses = resultFromState.frameAnalyses || [];

        const confidenceScore = parseFloat(analysisResult.ensembleFakeProbability || analysisResult.confidenceScore || "0");

        return {
            isDeepfake: analysisResult.isDeepfake || false,
            confidenceScore: confidenceScore * 100,
            frameAnalyses: frameAnalyses.map((frame) => ({
                frameNumber: frame.frameNumber || 0,
                timestamp: parseFloat(frame.timestampSeconds || "0"),
                confidence: parseFloat(frame.confidenceScore || "0") * 100,
                anomalyType: frame.anomalyType || "normal",
            })),
            metadata: {
                duration: Math.max(1, parseFloat(videoFile.durationSeconds || "30")),
                fps: parseInt(videoFile.fps || "30"),
                resolution: videoFile.resolution?.replace("X", "x") || "분석 중",
                codec: videoFile.format || "mp4",
                fileSize: file?.size || 0,
            },
            summary: analysisResult.summary || "분석 완료",
            processingTimeMs: analysisResult.processingTimeMs || 0,
            ensembleFakeProbability: confidenceScore * 100,
            modelAgreement: parseFloat(analysisResult.modelAgreement || "0") * 100,
            riskLevel: analysisResult.riskLevel || "UNKNOWN",
            individualModels: analysisResult.individualModels || null,
            detectedArtifacts: analysisResult.detectedArtifacts || null,
        };
    }, [resultFromState, file]);

    // ================= Fallback =================
    if (!results || !results.metadata) {
        return (
            <main className="flex items-center justify-center py-32">
                <div className="text-center p-8">
                    <h2 className="text-2xl font-bold text-text-main mb-4">
                        분석 결과를 불러올 수 없습니다
                    </h2>
                    <button
                        onClick={() => navigate("/video")}
                        className="px-6 py-3 rounded-full bg-primary text-white font-bold hover:bg-primary-dark"
                    >
                        다시 분석하기
                    </button>
                </div>
            </main>
        );
    }

    // ================= Utils =================
    const confidence = Math.round(results.confidenceScore);
    const duration = results.metadata.duration;
    const totalFrames = results.frameAnalyses.length;

    // 의심 프레임 (50% 이상, 상위 3개)
    const suspiciousFrames = results.frameAnalyses
        .map((frame, index) => ({ ...frame, originalIndex: index }))
        .filter(f => f.confidence > 50)
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 3);

    const getRiskColor = () => {
        const level = results.riskLevel;
        if (level === "CRITICAL" || level === "HIGH") return { text: "text-red-600", bg: "bg-red-50", border: "border-red-200" };
        if (level === "MEDIUM") return { text: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" };
        return { text: "text-green-600", bg: "bg-green-50", border: "border-green-200" };
    };

    const riskColors = getRiskColor();

    const getRiskLevelText = (level) => {
        const levels = {
            "CRITICAL": "매우 위험",
            "HIGH": "높음",
            "MEDIUM": "중간",
            "LOW": "낮음",
            "SAFE": "안전",
            "UNKNOWN": "분석 중"
        };
        return levels[level] || level;
    };

    const togglePlay = () => setIsPlaying(!isPlaying);
    const toggleMute = () => setIsMuted(!isMuted);
    const handleTimeUpdate = (e) => {
        if (e.target) setCurrentTime(e.target.currentTime);
    };
    const handleSeek = (e) => {
        setCurrentTime(parseFloat(e.target.value));
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const jumpToFrame = (index) => {
        const frame = results.frameAnalyses[index];
        if (frame) {
            setCurrentTime(frame.timestamp);
            setSelectedFrameIndex(index);
        }
    };

    // ================= Render =================
    return (
        <main className="relative px-6 pt-10 pb-20 max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-text-main mb-2 tracking-tight">
                    Video Analysis Results
                </h1>
                <p className="text-text-sub text-lg mb-3">{file?.name || resultFromState?.title}</p>
                <div className={`inline-block px-6 py-2 rounded-full ${riskColors.bg} border ${riskColors.border}`}>
                    <p className={`font-medium text-sm ${riskColors.text}`}>{results.summary}</p>
                </div>
            </div>

            <div className="w-full max-w-7xl mx-auto animate-fade-up space-y-6">
                {/* Video Player + Summary */}
                <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
                    {/* Left: Video Player (70%) */}
                    <div className="lg:col-span-7 space-y-4">
                        {videoUrl && (
                            <>
                                <div className="p-6 rounded-[24px] bg-white/60 backdrop-blur-md border border-white/60 shadow-glass-soft">
                                    <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
                                        <Video className="w-5 h-5" />
                                          분석 영상 재생
                                    </h3>
                                    <VideoPlayer
                                        videoUrl={videoUrl}
                                        currentTime={currentTime}
                                        onTimeUpdate={handleTimeUpdate}
                                        frameAnalyses={results.frameAnalyses}
                                        duration={duration}
                                        isPlaying={isPlaying}
                                        isMuted={isMuted}
                                        onPlayPause={togglePlay}
                                        onMuteToggle={toggleMute}
                                        onSeek={handleSeek}
                                    />
                                </div>

                                {totalFrames > 0 && (
                                    <FrameTimeline
                                        frameAnalyses={results.frameAnalyses}
                                        currentTime={currentTime}
                                        onFrameClick={jumpToFrame}
                                        duration={duration}
                                    />
                                )}
                            </>
                        )}
                    </div>

                    {/* Right: Summary (30%) */}
                    <div className="lg:col-span-3">
                        <div className="p-6 rounded-[24px] bg-white/60 backdrop-blur-md border border-white/60 shadow-glass-soft sticky top-6">
                            <h3 className="text-lg font-bold text-text-main mb-4">분석 요약</h3>

                            {/* Risk Score */}
                            <div className="text-center mb-4 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10">
                                <p className="text-xs text-text-sub mb-1">딥페이크 위험도</p>
                                <div className={`text-5xl font-bold ${riskColors.text} mb-2`}>
                                    {confidence}
                                    <span className="text-xl text-text-sub/50">/100</span>
                                </div>
                                <div className={`inline-block px-3 py-1 rounded-full ${riskColors.bg} border ${riskColors.border} font-bold text-sm ${riskColors.text}`}>
                                    {results.isDeepfake ? "딥페이크 의심" : "진짜"}
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="space-y-2 text-xs mb-4">
                                <div className="flex justify-between py-2 border-b border-primary/10">
                                    <span className="text-text-sub">위험 수준</span>
                                    <span className={`font-semibold ${riskColors.text}`}>
                                        {getRiskLevelText(results.riskLevel)}
                                    </span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-primary/10">
                                    <span className="text-text-sub">모델 합의도</span>
                                    <span className="font-semibold">{Math.round(results.modelAgreement)}%</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-primary/10">
                                    <span className="text-text-sub">분석 프레임</span>
                                    <span className="font-semibold">{totalFrames}개</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-primary/10">
                                    <span className="text-text-sub">의심 프레임</span>
                                    <span className={`font-semibold ${suspiciousFrames.length > 0 ? riskColors.text : ''}`}>
                                        {suspiciousFrames.length}개
                                    </span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="text-text-sub">처리 시간</span>
                                    <span className="font-semibold">
                                        {(results.processingTimeMs / 1000).toFixed(1)}초
                                    </span>
                                </div>
                            </div>

                            {/* Video Info */}
                            <div className="pt-4 border-t border-primary/10">
                                <p className="text-xs font-bold text-text-main mb-3">영상 정보</p>
                                <div className="space-y-2 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-text-sub">재생시간</span>
                                        <span className="font-medium">{formatTime(results.metadata.duration)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-text-sub">해상도</span>
                                        <span className="font-medium">{results.metadata.resolution}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-text-sub">FPS</span>
                                        <span className="font-medium">{results.metadata.fps}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-text-sub">파일크기</span>
                                        <span className="font-medium">{(results.metadata.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Suspicious Frame Analysis */}
                {suspiciousFrames.length > 0 && results.individualModels && (
                    <SuspiciousFrameAnalysis
                        suspiciousFrames={suspiciousFrames}
                        individualModels={results.individualModels}
                        videoUrl={videoUrl}
                        selectedFrameIndex={selectedFrameIndex}
                        onFrameSelect={(index) => {
                            setSelectedFrameIndex(index);
                            jumpToFrame(suspiciousFrames[index].originalIndex);
                        }}
                    />
                )}

                {/* Model Analysis - 추가 */}
                {results.individualModels && (
                    <ModelAnalysis
                        individualModels={results.individualModels}
                        modelAgreement={results.modelAgreement}
                    />
                )}

                {/* Artifact Detail - 추가 */}
                {results.detectedArtifacts && (
                    <ArtifactDetail
                        detectedArtifacts={results.detectedArtifacts}
                    />
                )}

                {/* Action Button */}
                <div className="flex justify-center pt-4">
                    <button
                        onClick={() => navigate("/video")}
                        className="px-8 py-3 rounded-full bg-primary text-white font-bold hover:bg-primary-dark transition-all shadow-lg hover:shadow-primary/30"
                    >
                        다른 파일 분석하기
                    </button>
                </div>
            </div>
        </main>
    );
}