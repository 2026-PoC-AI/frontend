/**
 * SuspiciousFrames 컴포넌트
 * 
 * 비디오 분석 결과 중 딥페이크 신뢰도가 가장 높은 상위 5개 프레임을 표시합니다.
 * 각 프레임을 클릭하면 비디오 플레이어가 해당 시점으로 이동합니다.
 * 
 * @param {Object} props
 * @param {Array} props.frameAnalyses - 프레임별 분석 데이터 배열
 *   - frameNumber: 프레임 번호
 *   - timestamp: 타임스탬프 (초)
 *   - confidence: 딥페이크 신뢰도 (0-100)
 *   - anomalyRegions: 이상 영역 정보
 * @param {Function} props.onFrameClick - 프레임 클릭 시 호출되는 콜백 (frameIndex)
 */

import { AlertTriangle, Clock, Target } from 'lucide-react';

export function SuspiciousFrames({ frameAnalyses, onFrameClick }) {
    // confidence가 높은 순으로 정렬하여 상위 5개 추출
    const topSuspiciousFrames = [...frameAnalyses]
        .map((frame, index) => ({ ...frame, originalIndex: index }))
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 5);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // confidence에 따른 위험도 레벨 결정
    const getRiskLevel = (confidence) => {
        if (confidence > 70) return { label: '높음', color: 'red' };
        if (confidence > 40) return { label: '중간', color: 'orange' };
        return { label: '낮음', color: 'green' };
    };

    // confidence에 따른 배경색 결정
    const getBackgroundColor = (confidence) => {
        if (confidence > 70) return 'bg-red-50 border-red-200';
        if (confidence > 40) return 'bg-orange-50 border-orange-200';
        return 'bg-green-50 border-green-200';
    };

    // confidence에 따른 텍스트 색상 결정
    const getTextColor = (confidence) => {
        if (confidence > 70) return 'text-red-600';
        if (confidence > 40) return 'text-orange-600';
        return 'text-green-600';
    };

    if (topSuspiciousFrames.length === 0) {
        return (
            <div className="p-8 rounded-[24px] bg-white/60 backdrop-blur-md border border-white/60 shadow-glass-soft">
                <h3 className="text-xl font-bold text-text-main mb-6">의심 프레임 분석</h3>
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="w-8 h-8 text-green-500" />
                    </div>
                    <p className="text-text-sub">의심스러운 프레임이 발견되지 않았습니다.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 rounded-[24px] bg-white/60 backdrop-blur-md border border-white/60 shadow-glass-soft">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-text-main">의심 프레임 분석</h3>
                    <p className="text-sm text-text-sub mt-1">
                        딥페이크 신뢰도가 가장 높은 {topSuspiciousFrames.length > 5 ? '상위 5개' : '전체'} 프레임
                    </p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-red-50 border border-red-200 rounded-full">
                    <Target className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium text-red-600">
                        {topSuspiciousFrames.length}개 발견
                    </span>
                </div>
            </div>

            {/* auto-fit 그리드 사용 */}
            <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                {topSuspiciousFrames.map((frame, index) => {
                    const riskLevel = getRiskLevel(frame.confidence);
                    
                    return (
                        <button
                            key={frame.originalIndex}
                            onClick={() => onFrameClick(frame.originalIndex)}
                            className={`p-4 rounded-xl border-2 transition-all hover:scale-105 hover:shadow-lg cursor-pointer text-left ${getBackgroundColor(frame.confidence)}`}
                        >
                            {/* 순위 배지 */}
                            <div className="flex items-center justify-between mb-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                                    index === 0 ? 'bg-red-500 text-white' :
                                    index === 1 ? 'bg-orange-500 text-white' :
                                    'bg-gray-400 text-white'
                                }`}>
                                    #{index + 1}
                                </div>
                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                    riskLevel.color === 'red' ? 'bg-red-100 text-red-700' :
                                    riskLevel.color === 'orange' ? 'bg-orange-100 text-orange-700' :
                                    'bg-green-100 text-green-700'
                                }`}>
                                    {riskLevel.label}
                                </span>
                            </div>

                            {/* 섬네일 (placeholder) */}
                            <div className="relative mb-3 aspect-video bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg overflow-hidden">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <AlertTriangle className={`w-8 h-8 mx-auto mb-1 ${getTextColor(frame.confidence)}`} />
                                        <p className="text-xs font-medium text-gray-600">
                                            프레임 #{frame.frameNumber}
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Confidence 오버레이 */}
                                <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 text-white text-xs font-bold rounded">
                                    {Math.round(frame.confidence)}%
                                </div>
                            </div>

                            {/* 프레임 정보 */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-xs text-gray-700">
                                    <Clock className="w-3 h-3" />
                                    <span>{formatTime(frame.timestamp)}</span>
                                </div>
                                
                                <div className={`text-sm font-semibold ${getTextColor(frame.confidence)}`}>
                                    신뢰도: {Math.round(frame.confidence)}%
                                </div>

                                {/* 클릭 안내 */}
                                <div className="text-xs text-gray-500 pt-2 border-t border-gray-300">
                                    클릭하여 이동 →
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* 안내 메시지 */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                    <div className="text-xl">ℹ️</div>
                    <div className="flex-1">
                        <p className="text-sm text-blue-900">
                            <strong>분석 기준:</strong> 각 프레임은 AI 모델이 얼굴 경계, 조명, 색상 일관성 등을 
                            종합적으로 분석하여 딥페이크 가능성을 판단합니다. 
                            신뢰도가 높을수록 딥페이크일 가능성이 높습니다.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}