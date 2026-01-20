/**
 * FrameTimeline 컴포넌트
 * 
 * 비디오의 전체 프레임을 타임라인 형태로 시각화하여 표시합니다.
 * 각 프레임의 딥페이크 신뢰도를 색상으로 구분하여 한눈에 파악할 수 있습니다.
 * 
 * @param {Object} props
 * @param {Array} props.frameAnalyses - 프레임별 분석 데이터 배열
 *   - frameNumber: 프레임 번호
 *   - timestamp: 타임스탬프 (초)
 *   - confidence: 딥페이크 신뢰도 (0-100)
 *   - anomalyRegions: 이상 영역 정보
 * @param {number} props.currentTime - 현재 재생 시점 (초)
 * @param {Function} props.onFrameClick - 프레임 클릭 시 호출되는 콜백 (frameIndex)
 * @param {number} props.duration - 비디오 총 재생 시간 (초)
 */

export function FrameTimeline({ frameAnalyses, currentTime, onFrameClick, duration }) {
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // 현재 재생 중인 프레임 인덱스 계산
    const currentFrameIndex = Math.floor((currentTime / duration) * frameAnalyses.length);

    // confidence에 따른 색상 결정
    const getBarColor = (confidence, isHovered, isCurrent) => {
        if (isCurrent) return 'bg-blue-500';
        if (isHovered) {
            if (confidence > 70) return 'bg-red-500';
            if (confidence > 40) return 'bg-yellow-500';
            return 'bg-green-500';
        }
        if (confidence > 70) return 'bg-red-400';
        if (confidence > 40) return 'bg-yellow-400';
        return 'bg-green-400';
    };

    return (
        <div className="p-8 rounded-[24px] bg-white/60 backdrop-blur-md border border-white/60 shadow-glass-soft">
            <h3 className="text-xl font-bold text-text-main mb-2">프레임별 신뢰도 타임라인</h3>
            <p className="text-sm text-text-sub mb-6">
                각 바는 프레임을 나타냅니다. 클릭하면 해당 시점으로 이동합니다.
            </p>
            
            <div className="space-y-4">
                {/* 타임라인 바 */}
                <div className="relative h-32 bg-paper rounded-lg overflow-hidden">
                    <div className="absolute inset-0 flex items-end gap-[1px]">
                        {frameAnalyses.map((frame, i) => {
                            const height = frame.confidence;
                            const isCurrent = i === currentFrameIndex;
                            
                            return (
                                <div
                                    key={i}
                                    className="flex-1 cursor-pointer transition-all duration-150 group relative"
                                    style={{ height: `${height}%` }}
                                    onClick={() => onFrameClick(i)}
                                >
                                    <div
                                        className={`h-full transition-all ${getBarColor(
                                            height,
                                            false,
                                            isCurrent
                                        )} group-hover:opacity-100 ${isCurrent ? 'opacity-100 scale-x-110 z-10' : 'opacity-70'}`}
                                    />
                                    
                                    {/* 호버 시 툴팁 */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20">
                                        <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                                            프레임 #{i}
                                            <br />
                                            {formatTime(frame.timestamp)}
                                            <br />
                                            신뢰도: {Math.round(height)}%
                                        </div>
                                        <div className="w-2 h-2 bg-gray-900 rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-1"></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* 현재 재생 위치 표시 라인 */}
                    <div 
                        className="absolute top-0 bottom-0 w-[2px] bg-blue-600 z-20 pointer-events-none"
                        style={{ 
                            left: `${(currentTime / duration) * 100}%`,
                            transition: 'left 0.1s linear'
                        }}
                    >
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-600 rounded-full"></div>
                    </div>
                </div>

                {/* 범례 */}
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-400 rounded" />
                            <span className="text-text-sub">안전 (0-40%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-yellow-400 rounded" />
                            <span className="text-text-sub">주의 (40-70%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-400 rounded" />
                            <span className="text-text-sub">위험 (70-100%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded" />
                            <span className="text-text-sub">현재 위치</span>
                        </div>
                    </div>
                    <span className="text-xs text-text-soft">
                        {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                </div>

                {/* 의심 프레임 요약 */}
                <div className="flex items-center justify-between pt-4 border-t border-primary/10">
                    <div className="text-sm">
                        <span className="text-text-sub">총 프레임: </span>
                        <span className="font-semibold text-text-main">{frameAnalyses.length}개</span>
                    </div>
                    <div className="text-sm">
                        <span className="text-text-sub">의심 프레임: </span>
                        <span className="font-semibold text-orange-600">
                            {frameAnalyses.filter(f => f.confidence > 70).length}개
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}