// src/pages/video/result/ModelAnalysis.jsx

import { Brain, TrendingUp, Eye, Clock } from "lucide-react";

export function ModelAnalysis({ individualModels, modelAgreement }) {
    if (!individualModels) return null;

    const models = [
    {
        key: 'xception',
        name: 'XceptionNet',
        icon: Eye,
        color: 'blue',
        description: '공간적 아티팩트 탐지',
    },
    {
        key: 'efficientnet',
        name: 'EfficientNet-B4',
        icon: TrendingUp,
        color: 'purple',
        description: '구조적 불일치 탐지',
    },
    {
        key: 'cnn_lstm',
        name: 'CNN-LSTM',
        icon: Clock,
        color: 'green',
        description: '시간적 일관성 분석',
    },
    ];

    const getColorClasses = (color) => {
    const colors = {
        blue: {
        bg: 'bg-blue-50',
        text: 'text-blue-600',
        border: 'border-blue-200',
        badge: 'bg-blue-100',
        },  
        purple: {
        bg: 'bg-purple-50',
        text: 'text-purple-600',
        border: 'border-purple-200',
        badge: 'bg-purple-100',
        },
        green: {
        bg: 'bg-green-50',
        text: 'text-green-600',
        border: 'border-green-200',
        badge: 'bg-green-100',
        },
    };
    return colors[color];
    };

    return (
    <div className="p-8 rounded-[24px] bg-white/60 backdrop-blur-md border border-white/60 shadow-glass-soft">
        <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
        </div>
        <div>
            <h3 className="text-xl font-bold text-text-main">개별 모델 분석 결과</h3>
            <p className="text-sm text-text-sub">3개 AI 모델의 독립적인 판단</p>
        </div>
        </div>

        {/* 모델 합의도 */}
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
        <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-text-sub">모델 합의도</span>
            <div className="flex items-center gap-2">
            <div className="w-32 h-2 bg-white/50 rounded-full overflow-hidden">
                <div
                className="h-full bg-gradient-to-r from-primary to-primary-dark rounded-full transition-all"
                style={{ width: `${modelAgreement}%` }}
                />
            </div>
            <span className="text-lg font-bold text-primary">{Math.round(modelAgreement)}%</span>
            </div>
        </div>
        <p className="text-xs text-text-soft mt-2">
            {modelAgreement >= 67 ? "모델들이 일치된 판단을 내렸습니다" : "모델들의 의견이 다소 상이합니다"}
        </p>
        </div>

      {/* 개별 모델 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {models.map((model) => {
            const data = individualModels[model.key];
            if (!data) return null;

            const colors = getColorClasses(model.color);
            const Icon = model.icon;
            const confidence = Math.round((data.fakeProbability || data.confidence) * 100);
            const isFake = data.prediction === 'fake';

            return (
            <div
                key={model.key}
                className={`p-6 rounded-xl border-2 ${colors.border} ${colors.bg} transition-all hover:shadow-lg`}
            >
              {/* 헤더 */}
                <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-lg ${colors.badge} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${colors.text}`} />
                </div>
                <div className="flex-1">
                    <h4 className={`font-bold ${colors.text}`}>{model.name}</h4>
                    <p className="text-xs text-text-soft">{model.description}</p>
                </div>
                </div>

                {/* 신뢰도 */}
                <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-text-sub">신뢰도</span>
                    <span className={`text-2xl font-bold ${colors.text}`}>{confidence}%</span>
                </div>
                <div className="w-full h-2 bg-white/50 rounded-full overflow-hidden">
                    <div
                    className={`h-full ${colors.text.replace('text-', 'bg-')} rounded-full transition-all`}
                    style={{ width: `${confidence}%` }}
                    />
                </div>
                </div>

                {/* 판단 */}
                <div className={`mb-4 px-3 py-2 rounded-lg text-center font-medium ${
                isFake ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                }`}>
                {isFake ? '딥페이크 의심' : '진짜'}
                </div>

              {/* 탐지 패턴 */}
                {data.detectedPatterns && data.detectedPatterns.length > 0 && (
                <div>
                    <p className="text-xs font-medium text-text-sub mb-2">탐지된 패턴:</p>
                    <ul className="space-y-1">
                    {data.detectedPatterns.map((pattern, idx) => (
                        <li key={idx} className="text-xs text-text-soft flex items-start gap-1">
                        <span className={`${colors.text} mt-0.5`}>•</span>
                        <span className="flex-1">{pattern}</span>
                        </li>
                    ))}
                    </ul>
                </div>
                )}

              {/* CNN-LSTM 의심 프레임 */}
                {model.key === 'cnn_lstm' && data.suspiciousFrames && data.suspiciousFrames.length > 0 && (
                <div className="mt-4 pt-4 border-t border-green-200">
                    <p className="text-xs font-medium text-text-sub mb-1">
                    의심 프레임: {data.suspiciousFrames.length}개
                    </p>
                    <p className="text-xs text-text-soft">
                    {data.suspiciousFrames.slice(0, 5).join(', ')}
                    {data.suspiciousFrames.length > 5 ? '...' : ''}
                    </p>
                </div>
                )}
            </div>
            );
        })}
        </div>

      {/* 설명 */}
        <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/10">
        <p className="text-sm text-text-sub">
            <span className="font-semibold text-text-main">💡 분석 방법:</span> 각 모델은 서로 다른 특징을 분석하여 독립적으로 판단합니다. 
            XceptionNet은 공간적 불일치, EfficientNet-B4는 다층 구조적 이상, CNN-LSTM은 시간적 연속성을 검사합니다.
        </p>
        </div>
    </div>
    );
}

export default ModelAnalysis;