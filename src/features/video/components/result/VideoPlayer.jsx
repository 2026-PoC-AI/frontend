/**
 * VideoPlayer 컴포넌트
 * 
 * 분석된 비디오를 재생하면서 실시간으로 딥페이크 신뢰도를 표시합니다.
 * 의심 구간을 시각적으로 하이라이트하고, 사용자가 특정 구간으로 이동할 수 있습니다.
 * 
 * @param {Object} props
 * @param {string} props.videoUrl - 비디오 파일 URL
 * @param {number} props.currentTime - 현재 재생 시점 (초)
 * @param {Function} props.onTimeUpdate - 시간 업데이트 콜백
 * @param {Array} props.frameAnalyses - 프레임별 분석 데이터
 * @param {number} props.duration - 비디오 총 재생 시간 (초)
 * @param {boolean} props.isPlaying - 재생 중 여부
 * @param {boolean} props.isMuted - 음소거 여부
 * @param {Function} props.onPlayPause - 재생/일시정지 토글
 * @param {Function} props.onMuteToggle - 음소거 토글
 * @param {Function} props.onSeek - 시크 이벤트 핸들러
 */

import { useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react';

export function VideoPlayer({ 
    videoUrl, 
    currentTime, 
    onTimeUpdate, 
    frameAnalyses, 
    duration,
    isPlaying,
    isMuted,
    onPlayPause,
    onMuteToggle,
    onSeek
}) {
    const videoRef = useRef(null);
    const containerRef = useRef(null);

    // 비디오 재생 상태 동기화 (안전하게 처리)
    useEffect(() => {
        if (videoRef.current && videoRef.current.readyState >= 2) {
            if (isPlaying) {
                videoRef.current.play().catch(err => {
                    console.error('Play error:', err);
                });
            } else {
                videoRef.current.pause();
            }
        }
    }, [isPlaying]);

    // 음소거 상태 동기화
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.muted = isMuted;
        }
    }, [isMuted]);

    // 현재 프레임의 confidence 가져오기
    const getCurrentFrameConfidence = () => {
        if (!frameAnalyses || frameAnalyses.length === 0) return 0;
        const frameIndex = Math.floor((currentTime / duration) * frameAnalyses.length);
        return frameAnalyses[frameIndex]?.confidence || 0;
    };

    const currentConfidence = getCurrentFrameConfidence();

    // confidence에 따른 색상
    const getConfidenceColor = (confidence) => {
        if (confidence > 70) return 'text-red-500 bg-red-500';
        if (confidence > 40) return 'text-yellow-500 bg-yellow-500';
        return 'text-green-500 bg-green-500';
    };

    // 시간 포맷팅
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // 전체화면
    const handleFullscreen = () => {
        if (containerRef.current) {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                containerRef.current.requestFullscreen();
            }
        }
    };

    // 의심 구간 계산 (연속된 의심 프레임들을 구간으로 묶음)
    const getSuspiciousRanges = () => {
        const ranges = [];
        let currentRange = null;

        frameAnalyses.forEach((frame, i) => {
            const position = (frame.timestamp / duration) * 100;
            
            if (frame.confidence > 70) {
                if (!currentRange) {
                    currentRange = { start: position, end: position };
                } else {
                    currentRange.end = position;
                }
            } else {
                if (currentRange) {
                    ranges.push(currentRange);
                    currentRange = null;
                }
            }
        });

        if (currentRange) {
            ranges.push(currentRange);
        }

        return ranges;
    };

    const suspiciousRanges = getSuspiciousRanges();

    return (
        <div className="p-8 rounded-[24px] bg-white/60 backdrop-blur-md border border-white/60 shadow-glass-soft">
            <div className="mb-4">
                <h3 className="text-xl font-bold text-text-main">비디오 재생</h3>
                <p className="text-sm text-text-sub mt-1">
                    재생하면서 실시간 딥페이크 신뢰도를 확인하세요
                </p>
            </div>

            <div ref={containerRef} className="bg-black rounded-xl overflow-hidden relative group">
                {/* 비디오 */}
                <video
                    ref={videoRef}
                    src={videoUrl}
                    className="w-full aspect-video"
                    onTimeUpdate={onTimeUpdate}
                    onClick={onPlayPause}
                    onError={(e) => {
                        console.error('Video error:', e);
                        console.error('Video error details:', videoRef.current?.error);
                    }}
                    onLoadedMetadata={() => {
                        console.log('Video metadata loaded');
                    }}
                />

                {/* 실시간 Confidence 오버레이 */}
                <div className="absolute top-4 right-4 px-4 py-2 bg-black/80 backdrop-blur-sm rounded-lg">
                    <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getConfidenceColor(currentConfidence).split(' ')[1]} animate-pulse`}></div>
                        <div className="text-white text-sm">
                            <div className="font-bold">딥페이크 신뢰도</div>
                            <div className={`text-2xl font-bold ${getConfidenceColor(currentConfidence).split(' ')[0]}`}>
                                {Math.round(currentConfidence)}%
                            </div>
                        </div>
                    </div>
                </div>

                {/* 일시정지 오버레이 */}
                {!isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <button
                            onClick={onPlayPause}
                            className="w-20 h-20 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all hover:scale-110"
                        >
                            <Play className="w-10 h-10 text-gray-800 ml-1" />
                        </button>
                    </div>
                )}

                {/* 컨트롤 바 */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* 시크바 */}
                    <div className="mb-3 relative">
                        {/* 의심 구간 하이라이트 */}
                        <div className="absolute inset-0 h-2 flex items-center">
                            {suspiciousRanges.map((range, i) => (
                                <div
                                    key={i}
                                    className="absolute h-full bg-red-500/50 rounded"
                                    style={{
                                        left: `${range.start}%`,
                                        width: `${range.end - range.start}%`
                                    }}
                                />
                            ))}
                        </div>

                        {/* 시크바 */}
                        <input
                            type="range"
                            min="0"
                            max={duration || 0}
                            step="0.1"
                            value={currentTime}
                            onChange={onSeek}
                            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer relative z-10"
                            style={{
                                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(currentTime / duration) * 100}%, #4b5563 ${(currentTime / duration) * 100}%, #4b5563 100%)`
                            }}
                        />
                    </div>

                    {/* 컨트롤 버튼 */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {/* 재생/일시정지 */}
                            <button
                                onClick={onPlayPause}
                                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                            >
                                {isPlaying ? (
                                    <Pause className="w-5 h-5 text-white" />
                                ) : (
                                    <Play className="w-5 h-5 text-white ml-0.5" />
                                )}
                            </button>

                            {/* 음소거 */}
                            <button
                                onClick={onMuteToggle}
                                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                            >
                                {isMuted ? (
                                    <VolumeX className="w-5 h-5 text-white" />
                                ) : (
                                    <Volume2 className="w-5 h-5 text-white" />
                                )}
                            </button>

                            {/* 시간 */}
                            <div className="text-white text-sm font-medium">
                                {formatTime(currentTime)} / {formatTime(duration)}
                            </div>
                        </div>

                        {/* 전체화면 */}
                        <button
                            onClick={handleFullscreen}
                            className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                        >
                            <Maximize2 className="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>
            </div>

            {/* 범례 */}
            <div className="mt-4 flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded"></div>
                        <span className="text-text-sub">의심 구간 (70%+)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded"></div>
                        <span className="text-text-sub">현재 재생 위치</span>
                    </div>
                </div>
                <span className="text-xs text-text-soft">
                    빨간 구간은 딥페이크 가능성이 높은 부분입니다
                </span>
            </div>
        </div>
    );
}