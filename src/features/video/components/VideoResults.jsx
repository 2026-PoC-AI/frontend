import { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Download, Share2, CheckCircle, AlertTriangle } from 'lucide-react';
import { useVideoStore } from '../../../store/videoStore';

// 새로 만든 컴포넌트들 import
import { VideoPlayer } from './result/VideoPlayer';
import { FrameTimeline } from './result/FrameTimeline';
import { SuspiciousFrames } from './result/SuspiciousFrames';
import { TechniqueDetail } from './result/TechniqueDetail';

export function VideoResults() {
    const navigate = useNavigate();
    const location = useLocation();
    
    const { file, fileFromState, result: resultFromState } = location.state || {};
    
    const [videoUrl, setVideoUrl] = useState('');

    const {
        isPlaying,
        isMuted,
        currentTime,
        setIsPlaying,
        setIsMuted,
        setCurrentTime,
    } = useVideoStore();

    // 비디오 파일 URL 생성
    useEffect(() => {
        console.log('resultFromState:', resultFromState);
        console.log('analysisId:', resultFromState?.analysisId);
        
        if (resultFromState?.analysisId) {
            const url = `http://localhost:8080/api/video/files/${resultFromState.analysisId}`;
            console.log('Setting video URL to:', url);
            setVideoUrl(url);
        } else if (fileFromState) {
            // analysisId가 없으면 임시로 blob URL 사용
            console.log('No analysisId, using blob URL');
            const blobUrl = URL.createObjectURL(fileFromState);
            setVideoUrl(blobUrl);
            
            return () => URL.revokeObjectURL(blobUrl);
        }
    }, [resultFromState, fileFromState]);

    // 백엔드 응답을 프론트 형식으로 변환 (useMemo로 무한 루프 방지)
    const results = useMemo(() => {
        if (!resultFromState) return null;
        
        const analysisResult = resultFromState.analysisResult || {};
        const videoFile = resultFromState.videoFile || {};
        const frameAnalyses = resultFromState.frameAnalyses || [];
        
        const confidenceScore = parseFloat(analysisResult.confidenceScore || '0');
        
        // detectedTechniques 파싱
        let techniques = [];
        const detectedTechniquesStr = analysisResult.detectedTechniques || '';
        
        if (detectedTechniquesStr && detectedTechniquesStr !== 'none') {
            const techniqueNames = detectedTechniquesStr.split(',').map(t => t.trim());
            
            const techniqueIcons = {
                'face_swap': '🎭',
                'deepfake': '🤖',
                'face_boundary_blur': '🔍',
                'blink_pattern_abnormal': '👁️',
                'frame_inconsistency': '📹',
                'lip_sync_mismatch': '👄',
                'none': '✅',
            };
            
            const techniqueLabels = {
                'face_swap': '얼굴 합성',
                'deepfake': 'AI 생성',
                'face_boundary_blur': '얼굴 경계 흐림',
                'blink_pattern_abnormal': '눈 깜빡임 이상',
                'frame_inconsistency': '프레임 불일치',
                'lip_sync_mismatch': '립싱크 불일치',
                'none': '이상 없음',
            };
            
            techniques = techniqueNames.map(name => ({
                name: techniqueLabels[name] || name,
                confidence: Math.round(confidenceScore * 100),
                icon: techniqueIcons[name] || '⚠️',
                anomalyType: name // 원본 키 추가
            }));
        }
        
        if (techniques.length === 0) {
            techniques = [{
                name: analysisResult.isDeepfake ? '딥페이크 의심' : '정상 영상',
                confidence: Math.round(confidenceScore * 100),
                icon: analysisResult.isDeepfake ? '⚠️' : '✅',
                anomalyType: 'normal'
            }];
        }
        
        return {
            isDeepfake: analysisResult.isDeepfake || false,
            confidenceScore: confidenceScore * 100,
            detectedTechniques: techniques,
            frameAnalyses: frameAnalyses.map(frame => ({
                frameNumber: frame.frameNumber || 0,
                timestamp: parseFloat(frame.timestampSeconds || '0'),
                confidence: parseFloat(frame.confidenceScore || '0.5') * 100,
                anomalyRegions: []
            })),
            metadata: {
                duration: Math.max(1, parseFloat(videoFile.durationSeconds || '30')),
                fps: parseInt(videoFile.fps || '30'),
                resolution: videoFile.resolution?.replace('X', 'x') || '1920x1080',
                codec: videoFile.format || 'mp4'
            },
            summary: analysisResult.summary || '분석 완료',
            processingTimeMs: analysisResult.processingTimeMs || 0
        };
    }, [resultFromState]);
    
    if (!results || !results.metadata) {
        return (
            <div className="min-h-screen bg-paper flex items-center justify-center">
                <div className="text-center p-8">
                    <h2 className="text-2xl font-bold text-text-main mb-4">
                        분석 결과를 불러올 수 없습니다
                    </h2>
                    <button
                        onClick={() => navigate('/video')}
                        className="px-6 py-3 rounded-full bg-primary text-white font-bold hover:bg-primary-dark"
                    >
                        다시 분석하기
                    </button>
                </div>
            </div>
        );
    }

    const confidence = Math.round(results.confidenceScore);
    const duration = results.metadata.duration;
    
    const getRiskColor = () => {
        if (confidence > 70) return { text: 'text-red-500', accent: '#ef4444', bg: 'bg-red-50' };
        if (confidence > 40) return { text: 'text-orange-500', accent: '#f59e0b', bg: 'bg-orange-50' };
        return { text: 'text-green-500', accent: '#10b981', bg: 'bg-green-50' };
    };

    const riskColors = getRiskColor();

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    const handleTimeUpdate = (e) => {
        if (e.target) {
            setCurrentTime(e.target.currentTime);
        }
    };

    const handleSeek = (e) => {
        const time = parseFloat(e.target.value);
        setCurrentTime(time);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // 프레임 점프 핸들러
    const jumpToFrame = (frameIndex) => {
        const frame = results.frameAnalyses[frameIndex];
        if (frame) {
            setCurrentTime(frame.timestamp);
        }
    };

    const suspiciousFrames = results.frameAnalyses.filter(f => f.confidence > 70).length;
    const totalFrames = results.frameAnalyses.length;

    return (
        <div className="min-h-screen bg-paper relative overflow-x-hidden">
            {/* 배경 그라데이션 */}
            <div 
                className="fixed inset-0 pointer-events-none"
                style={{
                    background: `
                        radial-gradient(
                            ellipse 80% 70% at 50% 40%,
                            var(--color-paper) 0%,
                            rgba(255,255,255,0.95) 25%,
                            color-mix(in srgb, var(--color-primary-soft) 30%, transparent) 50%,
                            color-mix(in srgb, var(--color-primary-sky) 40%, transparent) 75%,
                            color-mix(in srgb, var(--color-primary-mint) 45%, transparent) 100%
                        )
                    `,
                }}
            />

            {/* 네비게이션 */}
            <nav className="relative px-6 sm:px-10 lg:px-12 py-8 flex justify-between items-center max-w-6xl mx-auto z-10">
                <Link to="/" className="text-base sm:text-lg tracking-wider text-primary/70 font-bold">
                    FAKE HUNTERS
                </Link>
                <div className="hidden sm:flex gap-8 text-sm tracking-wider text-primary">
                    <Link to="/audio" className="opacity-70 hover:opacity-100">Audio</Link>
                    <Link to="/video" className="opacity-100 font-bold border-b-2 border-primary">Video</Link>
                    <Link to="/image" className="opacity-70 hover:opacity-100">Image</Link>
                    <Link to="/text" className="opacity-70 hover:opacity-100">Text</Link>
                </div>
            </nav>

            {/* 메인 컨텐츠 */}
            <main className="relative z-10 px-6 pt-10 pb-20 max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-text-main mb-4 tracking-tight">
                        Video Analysis Results
                    </h1>
                    <p className="text-text-sub text-lg">{file.name}</p>
                    
                    {/* 분석 요약 */}
                    <div className={`mt-4 inline-block px-6 py-3 rounded-full ${riskColors.bg} border ${riskColors.text} border-current`}>
                        <p className="font-medium">{results.summary}</p>
                    </div>
                </div>

                <div className="w-full max-w-5xl mx-auto animate-fade-up space-y-8">
                    {/* 위험도 점수 및 분석 정보 */}
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* 위험도 점수 */}
                        <div className="flex-1 p-8 rounded-[24px] bg-white/60 backdrop-blur-md border border-white/60 shadow-glass-soft flex flex-col items-center justify-center text-center">
                            <h3 className="text-lg font-medium text-text-sub mb-2">딥페이크 위험도</h3>
                            <div className={`text-6xl font-bold ${riskColors.text}`}>
                                {confidence}<span className="text-2xl text-text-sub/50">/100</span>
                            </div>
                            <div className="mt-4 px-4 py-1 rounded-full bg-paper border border-primary/10 text-text-main font-bold">
                                {results.isDeepfake ? '딥페이크 의심' : '진짜'}
                            </div>
                            
                            {/* 의심 프레임 통계 */}
                            <div className="mt-6 text-sm text-text-sub space-y-1">
                                <p>분석 프레임: {totalFrames}개</p>
                                <p className={suspiciousFrames > 0 ? 'text-orange-600 font-medium' : ''}>
                                    의심 프레임: {suspiciousFrames}개
                                </p>
                            </div>
                        </div>

                        {/* 분석 정보 */}
                        <div className="flex-[1.5] p-8 rounded-[24px] bg-white/60 backdrop-blur-md border border-white/60 shadow-glass-soft flex flex-col">
                            <h3 className="text-lg font-medium text-text-sub mb-4">분석 정보</h3>
                            <div className="flex-1 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl overflow-hidden flex items-center justify-center min-h-[300px] relative">
                                
                                {/* 분석 완료 정보 */}
                                <div className="text-center p-8">
                                    <div className={`w-20 h-20 ${results.isDeepfake ? 'bg-red-100' : 'bg-green-100'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                                        {results.isDeepfake ? (
                                            <AlertTriangle className="w-10 h-10 text-red-500" />
                                        ) : (
                                            <CheckCircle className="w-10 h-10 text-green-500" />
                                        )}
                                    </div>
                                    <h4 className="text-lg font-semibold text-text-main mb-2">
                                        분석 완료
                                    </h4>
                                    <p className="text-sm text-text-sub mb-4">
                                        {totalFrames}개 프레임 분석 완료
                                    </p>
                                    <div className="inline-block px-4 py-2 rounded-full bg-white/80 text-sm">
                                        처리 시간: {results.processingTimeMs}ms
                                    </div>
                                </div>

                                {/* 평균 신뢰도 표시 */}
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm">
                                    <span className="text-sm">
                                        평균 신뢰도: <strong className={riskColors.text}>{confidence}%</strong>
                                    </span>
                                </div>
                            </div>
                            <p className="text-xs text-text-soft mt-2 text-right">
                                * 비디오 파일은 서버에 안전하게 저장되었습니다
                            </p>
                        </div>
                    </div>

                    {/* 비디오 플레이어 */}
                    {videoUrl && (
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
                    )}

                    {/* 프레임 타임라인 */}
                    <FrameTimeline
                        frameAnalyses={results.frameAnalyses}
                        currentTime={currentTime}
                        onFrameClick={jumpToFrame}
                        duration={duration}
                    />

                    {/* 의심 프레임 Top 5 */}
                    <SuspiciousFrames
                        frameAnalyses={results.frameAnalyses}
                        onFrameClick={jumpToFrame}
                        videoUrl={videoUrl}
                    />

                    {/* 탐지된 기법 상세 */}
                    <TechniqueDetail
                        detectedTechniques={results.detectedTechniques}
                        showAll={false}
                    />

                    {/* 영상 정보 */}
                    <div className="p-8 rounded-[24px] bg-white/60 backdrop-blur-md border border-white/60 shadow-glass-soft">
                        <h3 className="text-xl font-bold text-text-main mb-6">영상 정보</h3>
                        
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between py-2 border-b border-primary/10">
                                <span className="text-text-sub">재생 시간</span>
                                <span className="text-text-main">{formatTime(results.metadata.duration)}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-primary/10">
                                <span className="text-text-sub">해상도</span>
                                <span className="text-text-main">{results.metadata.resolution}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-primary/10">
                                <span className="text-text-sub">FPS</span>
                                <span className="text-text-main">{results.metadata.fps}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-primary/10">
                                <span className="text-text-sub">코덱</span>
                                <span className="text-text-main">{results.metadata.codec}</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span className="text-text-sub">파일 크기</span>
                                <span className="text-text-main">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                            </div>
                        </div>
                    </div>

                    {/* 액션 버튼 */}
                    <div className="flex justify-center gap-4 pt-8">
                        <button
                            onClick={() => navigate('/video')}
                            className="px-8 py-3 rounded-full bg-primary text-white font-bold hover:bg-primary-dark transition-all shadow-lg hover:shadow-primary/30"
                        >
                            다른 파일 분석하기
                        </button>
                        <button className="px-8 py-3 rounded-full bg-white/60 backdrop-blur-md border border-white/60 text-text-main font-medium hover:bg-white/80 transition-all flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            리포트 다운로드
                        </button>
                        <button className="px-8 py-3 rounded-full bg-white/60 backdrop-blur-md border border-white/60 text-text-main font-medium hover:bg-white/80 transition-all flex items-center gap-2">
                            <Share2 className="w-4 h-4" />
                            결과 공유
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}