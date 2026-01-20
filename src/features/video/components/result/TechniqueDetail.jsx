/**
 * TechniqueDetail 컴포넌트
 * 
 * 딥페이크 탐지 과정에서 발견된 이상 징후와 기법들을 상세하게 표시합니다.
 * 각 기법 카드를 클릭하면 더 자세한 설명과 예방법을 확인할 수 있습니다.
 * 
 * @param {Object} props
 * @param {Array} props.detectedTechniques - 탐지된 기법 목록
 *   - name: 기법 이름
 *   - confidence: 탐지 신뢰도 (0-100)
 *   - icon: 표시할 아이콘 이모지
 * @param {boolean} props.showAll - 탐지되지 않은 기법도 표시할지 여부 (기본값: false)
 */

import { useState } from 'react';
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle, Info } from 'lucide-react';

// 모든 탐지 기법에 대한 상세 정보
const ALL_TECHNIQUES = {
    'face_boundary_blur': {
        title: '얼굴 경계 흐림',
        icon: '🔍',
        color: 'orange',
        description: '얼굴과 배경의 경계선이 부자연스럽게 흐릿하게 처리되어 있습니다.',
        why: '딥페이크 생성 시 얼굴을 합성하는 과정에서 경계를 자연스럽게 블렌딩하려다 발생합니다. AI가 실제 피부 질감과 배경의 전환을 완벽하게 재현하지 못해 나타나는 현상입니다.',
        prevention: '원본 영상과 비교하여 얼굴 테두리 부분의 선명도를 확인하세요. 고해상도 원본을 요청하거나, 여러 각도에서 촬영된 영상을 확인하는 것이 도움이 됩니다.',
        severity: 'medium'
    },
    'blink_pattern_abnormal': {
        title: '눈 깜빡임 이상',
        icon: '👁️',
        color: 'red',
        description: '정상적인 눈 깜빡임 패턴(분당 15-20회)과 다르거나, 부자연스러운 눈 깜빡임이 감지되었습니다.',
        why: '딥페이크 모델이 눈 깜빡임의 자연스러운 타이밍과 동작을 완벽하게 재현하지 못합니다. 특히 초기 딥페이크 모델들은 눈 깜빡임을 거의 생성하지 못했습니다.',
        prevention: '영상 속 인물의 눈 깜빡임 빈도와 패턴을 주의 깊게 관찰하세요. 너무 규칙적이거나, 거의 깜빡이지 않거나, 양쪽 눈이 비대칭적으로 깜빡인다면 의심해볼 수 있습니다.',
        severity: 'high'
    },
    'frame_inconsistency': {
        title: '프레임 간 불일치',
        icon: '📹',
        color: 'purple',
        description: '연속된 프레임 간에 얼굴 특징, 조명, 또는 색상이 갑자기 변화합니다.',
        why: 'AI 생성 과정에서 각 프레임을 독립적으로 처리하거나, 시간적 일관성을 완벽하게 유지하지 못해 발생합니다. 특히 빠른 움직임이나 조명 변화가 있을 때 두드러집니다.',
        prevention: '영상을 느린 속도로 재생하면서 프레임 간 전환을 확인하세요. 얼굴 특징이나 색감이 갑자기 변하는 부분이 있는지 주의 깊게 살펴보세요.',
        severity: 'high'
    },
    'lip_sync_mismatch': {
        title: '립싱크 불일치',
        icon: '👄',
        color: 'pink',
        description: '입 모양과 음성이 정확하게 일치하지 않습니다.',
        why: '음성을 조작하거나 얼굴을 합성할 때 정확한 립싱크 매칭이 매우 어렵습니다. 특히 빠른 발음이나 복잡한 단어에서 불일치가 자주 발생합니다.',
        prevention: '음성과 입 모양을 집중해서 관찰하세요. 특히 자음 발음(ㅂ, ㅁ, ㅍ 등)에서 입이 제대로 닫히는지 확인하세요.',
        severity: 'high'
    },
    'high_confidence_fake': {
        title: '고신뢰도 딥페이크',
        icon: '⚠️',
        color: 'red',
        description: 'AI 모델이 매우 높은 확률로 딥페이크로 판단했습니다.',
        why: '여러 이상 징후가 복합적으로 나타났거나, 특정 패턴이 매우 강하게 감지되었습니다. 전문적으로 제작된 딥페이크일 가능성이 높습니다.',
        prevention: '원본 출처를 철저히 확인하고, 가능하다면 전문가의 검증을 받으세요. 중요한 의사결정에 사용하기 전 다각도 검증이 필요합니다.',
        severity: 'critical'
    },
    'normal': {
        title: '정상',
        icon: '✅',
        color: 'green',
        description: '이상 징후가 발견되지 않았습니다.',
        why: '분석된 프레임에서 딥페이크의 전형적인 패턴이나 이상 징후가 감지되지 않았습니다.',
        prevention: '정상으로 판단되었지만, 중요한 경우 추가 검증을 권장합니다.',
        severity: 'low'
    }
};

export function TechniqueDetail({ detectedTechniques, showAll = false }) {
    const [expandedCard, setExpandedCard] = useState(null);

    const toggleCard = (techniqueName) => {
        setExpandedCard(expandedCard === techniqueName ? null : techniqueName);
    };

    // 표시할 기법 목록 결정
    const techniquesToShow = showAll 
        ? Object.keys(ALL_TECHNIQUES)
        : detectedTechniques.map(t => {
            // 백엔드에서 온 name을 key로 매핑
            const name = t.name || t.anomalyType || 'normal';
            return Object.keys(ALL_TECHNIQUES).find(key => 
                ALL_TECHNIQUES[key].title === name || key === name
            ) || 'normal';
        });

    // 중복 제거
    const uniqueTechniques = [...new Set(techniquesToShow)];

    // 탐지된 기법인지 확인
    const isDetected = (techniqueKey) => {
        return detectedTechniques.some(t => {
            const name = t.name || t.anomalyType || 'normal';
            return ALL_TECHNIQUES[techniqueKey].title === name || techniqueKey === name;
        });
    };

    // confidence 가져오기
    const getConfidence = (techniqueKey) => {
        const detected = detectedTechniques.find(t => {
            const name = t.name || t.anomalyType || 'normal';
            return ALL_TECHNIQUES[techniqueKey].title === name || techniqueKey === name;
        });
        return detected ? detected.confidence : 0;
    };

    // severity에 따른 색상
    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'critical': return 'border-red-500 bg-red-50';
            case 'high': return 'border-orange-500 bg-orange-50';
            case 'medium': return 'border-yellow-500 bg-yellow-50';
            case 'low': return 'border-green-500 bg-green-50';
            default: return 'border-gray-300 bg-gray-50';
        }
    };

    const getSeverityIcon = (severity) => {
        switch (severity) {
            case 'critical':
            case 'high': return <AlertCircle className="w-5 h-5 text-red-600" />;
            case 'medium': return <Info className="w-5 h-5 text-yellow-600" />;
            case 'low': return <CheckCircle className="w-5 h-5 text-green-600" />;
            default: return <Info className="w-5 h-5 text-gray-600" />;
        }
    };

    if (uniqueTechniques.length === 0) {
        return (
            <div className="p-8 rounded-[24px] bg-white/60 backdrop-blur-md border border-white/60 shadow-glass-soft">
                <h3 className="text-xl font-bold text-text-main mb-6">탐지된 이상 징후</h3>
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <p className="text-text-sub">이상 징후가 발견되지 않았습니다.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 rounded-[24px] bg-white/60 backdrop-blur-md border border-white/60 shadow-glass-soft">
            <div className="mb-6">
                <h3 className="text-xl font-bold text-text-main">탐지된 이상 징후</h3>
                <p className="text-sm text-text-sub mt-1">
                    각 카드를 클릭하면 상세 설명을 확인할 수 있습니다
                </p>
            </div>

            <div className="space-y-4">
                {uniqueTechniques.map((techniqueKey) => {
                    const technique = ALL_TECHNIQUES[techniqueKey];
                    const detected = isDetected(techniqueKey);
                    const confidence = getConfidence(techniqueKey);
                    const isExpanded = expandedCard === techniqueKey;

                    if (!detected && !showAll) return null;

                    return (
                        <div
                            key={techniqueKey}
                            className={`rounded-xl border-2 transition-all ${
                                detected 
                                    ? getSeverityColor(technique.severity)
                                    : 'border-gray-200 bg-gray-50 opacity-60'
                            }`}
                        >
                            {/* 카드 헤더 */}
                            <button
                                onClick={() => toggleCard(techniqueKey)}
                                className="w-full p-4 flex items-center justify-between hover:bg-black/5 transition-colors rounded-xl"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="text-3xl">{technique.icon}</div>
                                    <div className="text-left">
                                        <div className="font-semibold text-text-main flex items-center gap-2">
                                            {technique.title}
                                            {detected && getSeverityIcon(technique.severity)}
                                        </div>
                                        {detected && (
                                            <div className="text-sm text-text-sub">
                                                탐지 신뢰도: <span className="font-medium">{confidence}%</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {isExpanded ? (
                                    <ChevronUp className="w-5 h-5 text-text-sub" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-text-sub" />
                                )}
                            </button>

                            {/* 상세 설명 (확장 시) */}
                            {isExpanded && (
                                <div className="px-4 pb-4 space-y-4 border-t border-current/10 pt-4">
                                    {/* 설명 */}
                                    <div>
                                        <h4 className="font-semibold text-sm text-text-main mb-1">
                                            📋 증상
                                        </h4>
                                        <p className="text-sm text-text-sub">
                                            {technique.description}
                                        </p>
                                    </div>

                                    {/* 발생 원인 */}
                                    <div>
                                        <h4 className="font-semibold text-sm text-text-main mb-1">
                                            🔬 발생 원인
                                        </h4>
                                        <p className="text-sm text-text-sub">
                                            {technique.why}
                                        </p>
                                    </div>

                                    {/* 예방/대응 방법 */}
                                    <div>
                                        <h4 className="font-semibold text-sm text-text-main mb-1">
                                            🛡️ 확인 방법
                                        </h4>
                                        <p className="text-sm text-text-sub">
                                            {technique.prevention}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* 안내 메시지 */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                    <div className="text-xl">💡</div>
                    <div className="flex-1">
                        <p className="text-sm text-blue-900">
                            <strong>참고:</strong> 단일 징후만으로 딥페이크를 확정할 수 없습니다. 
                            여러 징후가 복합적으로 나타날 때 딥페이크일 가능성이 높아집니다. 
                            중요한 판단이 필요한 경우 전문가의 추가 검증을 권장합니다.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}