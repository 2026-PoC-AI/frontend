// src/pages/video/result/SuspiciousFrameAnalysis.jsx

import { useState, useEffect, useRef } from "react";
import { Eye, TrendingUp, Clock, AlertTriangle } from "lucide-react";

export function SuspiciousFrameAnalysis({ 
    suspiciousFrames, 
    individualModels, 
    videoUrl 
}) {
    const [thumbnails, setThumbnails] = useState([]);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    // ================= 썸네일 추출 =================
    useEffect(() => {
        if (!videoUrl || suspiciousFrames.length === 0) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;

        const ctx = canvas.getContext("2d");

        const extractThumbnails = async () => {
            const extracted = [];

            for (let i = 0; i < suspiciousFrames.length; i++) {
                const frame = suspiciousFrames[i];

                await new Promise((resolve) => {
                    const seeked = () => {
                        video.removeEventListener("seeked", seeked);

                        canvas.width = video.videoWidth;
                        canvas.height = video.videoHeight;
                        ctx.drawImage(video, 0, 0);

                        const thumbnail = canvas.toDataURL("image/jpeg", 0.7);
                        extracted.push({ ...frame, thumbnail });

                        resolve();
                    };

                    video.addEventListener("seeked", seeked);
                    video.currentTime = frame.timestamp;
                });
            }

            setThumbnails(extracted);
        };

        const handleLoadedMetadata = () => {
            extractThumbnails();
        };

        video.addEventListener("loadedmetadata", handleLoadedMetadata);

        return () => {
            video.removeEventListener("loadedmetadata", handleLoadedMetadata);
        };
    }, [videoUrl, suspiciousFrames]);

    // ================= Utils =================
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const getModelIcon = (modelKey) => {
        const icons = {
            'xception': Eye,
            'efficientnet': TrendingUp,
            'cnn_lstm': Clock,
        };
        return icons[modelKey] || AlertTriangle;
    };

    const getModelColor = (modelKey) => {
        const colors = {
            'xception': { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
            'efficientnet': { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
            'cnn_lstm': { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' },
        };
        return colors[modelKey] || { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' };
    };

    // ================= Render =================
    return (
        <div className="p-8 rounded-[24px] bg-white/60 backdrop-blur-md border border-white/60 shadow-glass-soft">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-text-main">의심 프레임 상세 분석</h3>
                    <p className="text-sm text-text-sub">신뢰도 상위 3개 프레임</p>
                </div>
            </div>

            {/* Frame List (세로 배치) */}
            <div className="space-y-6">
                {suspiciousFrames.map((frame, index) => {
                    const thumbnail = thumbnails.find(t => t.frameNumber === frame.frameNumber);
                    const rankColors = ['text-yellow-600', 'text-gray-500', 'text-orange-700'];
                    const rankBgColors = ['bg-yellow-100', 'bg-gray-100', 'bg-orange-100'];

                    return (
                        <div 
                            key={frame.frameNumber}
                            className="p-6 rounded-xl border-2 border-orange-200 bg-gradient-to-br from-orange-50/50 to-red-50/50"
                        >
                            {/* 프레임 정보 헤더 */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`w-8 h-8 rounded-full ${rankBgColors[index]} flex items-center justify-center`}>
                                    <span className={`text-sm font-bold ${rankColors[index]}`}>{index + 1}</span>
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-lg font-bold text-text-main">
                                        프레임 #{frame.frameNumber}
                                    </h4>
                                    <div className="flex items-center gap-3 text-sm text-text-sub">
                                        <span>{formatTime(frame.timestamp)}초</span>
                                        <span>•</span>
                                        <span className="font-bold text-red-600">신뢰도 {Math.round(frame.confidence)}%</span>
                                        <span>•</span>
                                        <span>유형: {frame.anomalyType}</span>
                                    </div>
                                </div>
                            </div>

                            {/* 썸네일 + 모델 분석 */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {/* 썸네일 */}
                                <div className="col-span-1">
                                    <div className="aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center border-2 border-white/60 shadow-lg">
                                        {thumbnail ? (
                                            <img
                                                src={thumbnail.thumbnail}
                                                alt={`Frame ${frame.frameNumber}`}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                        )}
                                    </div>
                                </div>

                                {/* 모델별 판단 */}
                                <div className="col-span-3 space-y-3">
                                    {Object.entries(individualModels).map(([key, model]) => {
                                        const Icon = getModelIcon(key);
                                        const colors = getModelColor(key);
                                        const confidence = Math.round((model.fakeProbability || model.confidence) * 100);
                                        const isFake = model.prediction === 'fake';

                                        return (
                                            <div 
                                                key={key}
                                                className={`p-4 rounded-lg border ${colors.border} ${colors.bg} flex items-start gap-3`}
                                            >
                                                {/* 아이콘 */}
                                                <div className={`w-10 h-10 rounded-lg ${colors.bg} border ${colors.border} flex items-center justify-center flex-shrink-0`}>
                                                    <Icon className={`w-5 h-5 ${colors.text}`} />
                                                </div>

                                                {/* 내용 */}
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h5 className={`font-bold ${colors.text}`}>{model.modelName}</h5>
                                                        <div className="flex items-center gap-2">
                                                            <span className={`text-lg font-bold ${colors.text}`}>
                                                                {confidence}%
                                                            </span>
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                                isFake ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                                                            }`}>
                                                                {isFake ? '딥페이크 의심' : '진짜'}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* 탐지 패턴 */}
                                                    {model.detectedPatterns && model.detectedPatterns.length > 0 && (
                                                        <ul className="space-y-1">
                                                            {model.detectedPatterns.map((pattern, idx) => (
                                                                <li key={idx} className="text-sm text-text-main flex items-start gap-2">
                                                                    <span className={`${colors.text} mt-0.5`}>•</span>
                                                                    <span>{pattern}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 분석 설명 */}
            <div className="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-200">
                <p className="text-sm text-text-main">
                    <span className="font-semibold">분석 방법:</span> 각 모델이 독립적으로 프레임을 분석하여 딥페이크 여부를 판단합니다. 
                    여러 모델이 동시에 높은 신뢰도로 의심을 표시할수록 딥페이크일 가능성이 높습니다.
                </p>
            </div>

            {/* Hidden Video & Canvas */}
            <video
                ref={videoRef}
                src={videoUrl}
                className="hidden"
                muted
                playsInline
                crossOrigin="anonymous"
            />
            <canvas ref={canvasRef} className="hidden" />
        </div>
    );
}