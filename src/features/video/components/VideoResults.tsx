import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Play, Pause, Volume2, VolumeX, Maximize, AlertTriangle, CheckCircle2, XCircle, Download, Share2, ArrowLeft, Shield } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Progress } from '../../../components/ui/Progress';
import { GamifiedAction } from './GamifiedAction';

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

    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration] = useState(mockResults.metadata.duration);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [hoveredFrame, setHoveredFrame] = useState<number | null>(null);

    const results = mockResults;
    const confidence = Math.round(results.confidenceScore);

    const getRiskColor = () => {
        if (confidence > 80) return { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', accent: '#ef4444' };
        if (confidence > 50) return { bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-200', accent: '#f59e0b' };
        return { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200', accent: '#10b981' };
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

    const handleBack = () => {
        navigate('/video');
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-6">
                <Button variant="outline" onClick={handleBack} className="mb-4">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    돌아가기
                </Button>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">영상 분석 결과</h2>
                <p className="text-base sm:text-lg text-gray-600">{file.name}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                        <div className="aspect-video bg-gray-900 relative group">
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

                            <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2">
                                <div className="flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-white" />
                                    <span className="text-white text-sm">
                                        신뢰도: <strong>{Math.round(currentFrameConfidence)}%</strong>
                                    </span>
                                </div>
                            </div>

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
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold mb-4">프레임별 신뢰도 분석</h3>
                        
                        <div className="space-y-4">
                            <div className="relative h-32 bg-gray-50 rounded-lg overflow-hidden">
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
                                                            ? 'bg-[#33C3AD]'
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
                                    className="absolute top-0 bottom-0 w-0.5 bg-[#33C3AD] z-10"
                                    style={{ left: `${(currentTime / duration) * 100}%` }}
                                >
                                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-[#33C3AD] rounded-full" />
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-sm text-gray-600">
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
                                <span className="text-xs text-gray-500">클릭하여 해당 시점으로 이동</span>
                            </div>

                            {hoveredFrame !== null && (
                                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
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
                </div>

                <div className="space-y-6">
                    <div className={`rounded-2xl p-6 shadow-sm border-2 ${riskColors.bg} ${riskColors.border}`}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold">탐지 결과</h3>
                            {results.isDeepfake ? (
                                <XCircle className={`w-8 h-8 ${riskColors.text}`} />
                            ) : (
                                <CheckCircle2 className={`w-8 h-8 ${riskColors.text}`} />
                            )}
                        </div>

                        <div className="flex items-center justify-center mb-6">
                            <div className="relative w-40 h-40">
                                <svg className="transform -rotate-90 w-40 h-40">
                                    <circle
                                        cx="80"
                                        cy="80"
                                        r="70"
                                        stroke="currentColor"
                                        strokeWidth="12"
                                        fill="transparent"
                                        className="text-gray-200"
                                    />
                                    <circle
                                        cx="80"
                                        cy="80"
                                        r="70"
                                        stroke={riskColors.accent}
                                        strokeWidth="12"
                                        fill="transparent"
                                        strokeDasharray={`${2 * Math.PI * 70}`}
                                        strokeDashoffset={`${2 * Math.PI * 70 * (1 - confidence / 100)}`}
                                        className="transition-all duration-1000"
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <div className={`text-4xl font-bold ${riskColors.text}`}>{confidence}%</div>
                                    <div className="text-sm text-gray-600 mt-1">
                                        {results.isDeepfake ? '딥페이크' : '진짜'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>신뢰도</span>
                                <span>{confidence}%</span>
                            </div>
                            <Progress value={confidence} className="h-2" />
                        </div>

                        {results.isDeepfake && (
                            <div className="mt-4 p-4 rounded-lg bg-white/50 border border-red-200">
                                <div className="flex items-start gap-2">
                                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium text-sm mb-1">경고</p>
                                        <p className="text-sm text-gray-600">
                                            이 영상은 AI로 조작되었을 가능성이 높습니다.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold mb-4">탐지된 기법</h3>
                        
                        <div className="space-y-3">
                            {results.detectedTechniques.map((technique, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl">{technique.icon}</span>
                                            <span className="text-sm">{technique.name}</span>
                                        </div>
                                        <span className="text-sm text-gray-500">{technique.confidence}%</span>
                                    </div>
                                    <Progress value={technique.confidence} className="h-2" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold mb-4">영상 정보</h3>
                        
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">재생 시간</span>
                                <span>{formatTime(results.metadata.duration)}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">해상도</span>
                                <span>{results.metadata.resolution}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">FPS</span>
                                <span>{results.metadata.fps}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">코덱</span>
                                <span>{results.metadata.codec}</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span className="text-gray-600">파일 크기</span>
                                <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button className="flex-1 bg-[#33C3AD] hover:bg-[#33C3AD]/90 text-white">
                            <Download className="w-4 h-4 mr-2" />
                            리포트
                        </Button>
                        <Button variant="outline" className="flex-1">
                            <Share2 className="w-4 h-4 mr-2" />
                            공유
                        </Button>
                    </div>
                </div>
            </div>

            <video ref={videoRef} className="hidden" onTimeUpdate={handleTimeUpdate} />

            <div className="mt-8">
                <GamifiedAction
                    isDeepfake={results.isDeepfake}
                    confidence={confidence}
                    fileName={file.name}
                    onAction={(action) => {
                        console.log(`Action: ${action}`);
                        setTimeout(() => {
                            navigate('/video');
                        }, 2000);
                    }}
                />
            </div>
        </div>
    );
}