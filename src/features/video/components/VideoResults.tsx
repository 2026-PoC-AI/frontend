import { useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Play, Pause, Volume2, VolumeX, Maximize, Download, Share2 } from 'lucide-react';
import { useVideoStore } from '../../../store/videoStore';

const mockResults = {
    isDeepfake: Math.random() > 0.5,
    confidenceScore: 75 + Math.random() * 20,
    detectedTechniques: [
        { name: '얼굴 합성 (Face Swap)', confidence: 89, icon: '🎭' },
        { name: '음성 변조 (Voice Clone)', confidence: 76, icon: '🎤' },
        { name: 'AI 생성 패턴', confidence: 82, icon: '🤖' },
    ],
    frameAnalyses: Array.from({ length: 50 }, (_, i) => ({
        frameNumber: i,
        timestamp: i * 2,
        confidence: 40 + Math.random() * 60,
        anomalyRegions: Math.random() > 0.7 ? [
            { x: 100, y: 100, width: 150, height: 150, type: 'face' },
        ] : [],
    })),
    metadata: {
        duration: 100,
        fps: 30,
        resolution: '1920x1080',
        codec: 'H.264',
    },
};

export function VideoResults() {
    const navigate = useNavigate();
    const location = useLocation();
    const file = location.state?.file || { name: 'video.mp4', size: 10485760 };
    const videoRef = useRef<HTMLVideoElement>(null);

    const {
        results,
        isPlaying,
        isMuted,
        currentTime,
        hoveredFrame,
        setResults,
        setIsPlaying,
        setIsMuted,
        setCurrentTime,
        setHoveredFrame,
    } = useVideoStore();

    useEffect(() => {
        setResults(mockResults);
        return () => {
            // cleanup은 선택사항
        };
    }, [setResults]);

    if (!results) return null;

    const confidence = Math.round(results.confidenceScore);
    const duration = results.metadata.duration;

    const getRiskColor = () => {
        if (confidence > 80) return { text: 'text-red-500', accent: '#ef4444' };
        if (confidence > 50) return { text: 'text-orange-500', accent: '#f59e0b' };
        return { text: 'text-green-500', accent: '#10b981' };
    };

    const riskColors = getRiskColor();

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = parseFloat(e.target.value);
        setCurrentTime(time);
        if (videoRef.current) {
            videoRef.current.currentTime = time;
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getCurrentFrameConfidence = () => {
        const frameIndex = Math.floor((currentTime / duration) * results.frameAnalyses.length);
        return results.frameAnalyses[frameIndex]?.confidence || 50;
    };

    const currentFrameConfidence = getCurrentFrameConfidence();

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
                </div>

                <div className="w-full max-w-5xl mx-auto animate-fade-up space-y-8">
                    {/* 위험도 점수 및 비디오 플레이어 */}
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
                        </div>

                        {/* 비디오 플레이어 */}
                        <div className="flex-[1.5] p-8 rounded-[24px] bg-white/60 backdrop-blur-md border border-white/60 shadow-glass-soft flex flex-col">
                            <h3 className="text-lg font-medium text-text-sub mb-4">영상 미리보기</h3>
                            <div className="flex-1 bg-black/90 rounded-xl overflow-hidden flex items-center justify-center min-h-[300px] relative group">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <button
                                        onClick={togglePlay}
                                        className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors group-hover:scale-110 duration-200"
                                    >
                                        {isPlaying ? (
                                            <Pause className="w-10 h-10 text-white" />
                                        ) : (
                                            <Play className="w-10 h-10 text-white ml-1" />
                                        )}
                                    </button>
                                </div>

                                {/* 의심 영역 표시 */}
                                {results.frameAnalyses[Math.floor((currentTime / duration) * results.frameAnalyses.length)]?.anomalyRegions.map((region, idx) => (
                                    <div
                                        key={idx}
                                        className="absolute border-2 border-red-500 bg-red-500/20 animate-pulse"
                                        style={{
                                            left: `${(region.x / 1920) * 100}%`,
                                            top: `${(region.y / 1080) * 100}%`,
                                            width: `${(region.width / 1920) * 100}%`,
                                            height: `${(region.height / 1080) * 100}%`,
                                        }}
                                    >
                                        <div className="absolute -top-6 left-0 bg-red-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                            의심 영역
                                        </div>
                                    </div>
                                ))}

                                {/* 신뢰도 표시 */}
                                <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2">
                                    <span className="text-white text-sm">
                                        신뢰도: <strong>{Math.round(currentFrameConfidence)}%</strong>
                                    </span>
                                </div>

                                {/* 컨트롤 바 */}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="flex items-center gap-3 text-white">
                                        <button onClick={togglePlay} className="hover:scale-110 transition-transform">
                                            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                                        </button>
                                        
                                        <button onClick={toggleMute} className="hover:scale-110 transition-transform">
                                            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                                        </button>

                                        <span className="text-sm">{formatTime(currentTime)}</span>
                                        
                                        <div className="flex-1 mx-2">
                                            <input
                                                type="range"
                                                min="0"
                                                max={duration}
                                                value={currentTime}
                                                onChange={handleSeek}
                                                className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                                            />
                                        </div>

                                        <span className="text-sm">{formatTime(duration)}</span>

                                        <button className="hover:scale-110 transition-transform ml-auto">
                                            <Maximize className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <p className="text-xs text-text-soft mt-2 text-right">
                                * 클릭하여 재생/일시정지
                            </p>
                        </div>
                    </div>

                    {/* 프레임별 신뢰도 분석 */}
                    <div className="p-8 rounded-[24px] bg-white/60 backdrop-blur-md border border-white/60 shadow-glass-soft">
                        <h3 className="text-xl font-bold text-text-main mb-6">프레임별 신뢰도 분석</h3>
                        
                        <div className="space-y-4">
                            <div className="relative h-32 bg-paper rounded-lg overflow-hidden">
                                <div className="absolute inset-0 flex items-end">
                                    {results.frameAnalyses.map((frame, i) => {
                                        const height = frame.confidence;
                                        const isHovered = hoveredFrame === i;
                                        const isCurrent = Math.floor((currentTime / duration) * results.frameAnalyses.length) === i;
                                        
                                        return (
                                            <div
                                                key={i}
                                                className="flex-1 cursor-pointer transition-all duration-150"
                                                style={{ height: `${height}%` }}
                                                onMouseEnter={() => setHoveredFrame(i)}
                                                onMouseLeave={() => setHoveredFrame(null)}
                                                onClick={() => {
                                                    const time = (i / results.frameAnalyses.length) * duration;
                                                    setCurrentTime(time);
                                                    if (videoRef.current) {
                                                        videoRef.current.currentTime = time;
                                                    }
                                                }}
                                            >
                                                <div
                                                    className={`h-full transition-all ${
                                                        isCurrent
                                                            ? 'bg-primary'
                                                            : height > 80
                                                            ? 'bg-red-400 hover:bg-red-500'
                                                            : height > 50
                                                            ? 'bg-yellow-400 hover:bg-yellow-500'
                                                            : 'bg-green-400 hover:bg-green-500'
                                                    } ${isHovered ? 'opacity-100' : 'opacity-70'}`}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>

                                <div
                                    className="absolute top-0 bottom-0 w-0.5 bg-primary z-10"
                                    style={{ left: `${(currentTime / duration) * 100}%` }}
                                >
                                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-primary rounded-full" />
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-sm text-text-sub">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-green-400 rounded" />
                                        <span>안전</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-yellow-400 rounded" />
                                        <span>주의</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-red-400 rounded" />
                                        <span>위험</span>
                                    </div>
                                </div>
                                <span className="text-xs text-text-soft">클릭하여 해당 시점으로 이동</span>
                            </div>

                            {hoveredFrame !== null && (
                                <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm">
                                    <div className="flex items-center justify-between">
                                        <span>프레임 #{hoveredFrame}</span>
                                        <span className="font-semibold">
                                            신뢰도: {Math.round(results.frameAnalyses[hoveredFrame].confidence)}%
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 탐지된 기법 */}
                    <div className="p-8 rounded-[24px] bg-white/60 backdrop-blur-md border border-white/60 shadow-glass-soft">
                        <h3 className="text-xl font-bold text-text-main mb-6">탐지된 이상 징후</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {results.detectedTechniques.map((item, idx) => (
                                <div key={idx} className="p-4 rounded-xl bg-paper/50 border border-primary/10 hover:border-primary/30 transition-colors">
                                    <div className="text-2xl mb-2">{item.icon}</div>
                                    <div className="text-sm text-text-main font-medium mb-1">{item.name}</div>
                                    <div className="text-xs text-text-sub">신뢰도: {item.confidence}%</div>
                                </div>
                            ))}
                        </div>
                    </div>

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
                            리포트
                        </button>
                        <button className="px-8 py-3 rounded-full bg-white/60 backdrop-blur-md border border-white/60 text-text-main font-medium hover:bg-white/80 transition-all flex items-center gap-2">
                            <Share2 className="w-4 h-4" />
                            공유
                        </button>
                    </div>
                </div>
            </main>

            <video ref={videoRef} className="hidden" onTimeUpdate={handleTimeUpdate} />
        </div>
    );
}