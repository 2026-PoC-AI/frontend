// src/pages/video/result/ArtifactDetail.jsx

import { AlertCircle, Layers, GitBranch, Eye } from "lucide-react";

export function ArtifactDetail({ detectedArtifacts }) {
  if (!detectedArtifacts) return null;

  const artifacts = [
    {
      key: 'spatial',
      name: '공간적 아티팩트',
      icon: Eye,
      color: 'blue',
      description: '얼굴 경계, 피부 텍스처의 이상',
    },
    {
      key: 'temporal',
      name: '시간적 아티팩트',
      icon: GitBranch,
      color: 'green',
      description: '프레임 간 불연속성, 움직임 이상',
    },
    {
      key: 'structural',
      name: '구조적 아티팩트',
      icon: Layers,
      color: 'purple',
      description: '조명, 그림자, 다층 구조 불일치',
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: 'bg-blue-50',
        text: 'text-blue-600',
        border: 'border-blue-200',
        icon: 'bg-blue-100',
      },
      green: {
        bg: 'bg-green-50',
        text: 'text-green-600',
        border: 'border-green-200',
        icon: 'bg-green-100',
      },
      purple: {
        bg: 'bg-purple-50',
        text: 'text-purple-600',
        border: 'border-purple-200',
        icon: 'bg-purple-100',
      },
    };
    return colors[color];
  };

  const hasAnyArtifact = Object.values(detectedArtifacts).some(a => a.detected);

  return (
    <div className="p-8 rounded-[24px] bg-white/60 backdrop-blur-md border border-white/60 shadow-glass-soft">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
          <AlertCircle className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-text-main">탐지된 딥페이크 아티팩트</h3>
          <p className="text-sm text-text-sub">AI가 발견한 의심스러운 패턴</p>
        </div>
      </div>

      {!hasAnyArtifact ? (
        <div className="py-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <Eye className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-text-sub font-medium">의심스러운 아티팩트가 발견되지 않았습니다</p>
          <p className="text-sm text-text-soft mt-2">영상이 자연스러운 것으로 판단됩니다</p>
        </div>
      ) : (
        <div className="space-y-4">
          {artifacts.map((artifact) => {
            const data = detectedArtifacts[artifact.key];
            if (!data) return null;

            const colors = getColorClasses(artifact.color);
            const Icon = artifact.icon;

            return (
              <div
                key={artifact.key}
                className={`p-6 rounded-xl border-2 transition-all ${
                  data.detected
                    ? `${colors.border} ${colors.bg} shadow-md`
                    : 'border-gray-200 bg-gray-50 opacity-50'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* 아이콘 */}
                  <div className={`w-12 h-12 rounded-lg ${colors.icon} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-6 h-6 ${colors.text}`} />
                  </div>

                  {/* 내용 */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className={`font-bold ${colors.text}`}>{artifact.name}</h4>
                      {data.detected ? (
                        <span className="px-2 py-1 rounded-full bg-red-100 text-red-600 text-xs font-medium">
                          탐지됨
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-medium">
                          탐지 안됨
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-text-soft mb-3">{artifact.description}</p>

                    {data.detected && (
                      <>
                        {/* 탐지 소스 */}
                        {data.sources && data.sources.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs font-medium text-text-sub mb-1">탐지 모델:</p>
                            <div className="flex flex-wrap gap-2">
                              {data.sources.map((source, idx) => (
                                <span
                                  key={idx}
                                  className={`px-3 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text} border ${colors.border}`}
                                >
                                  {source}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 탐지 패턴 */}
                        {data.patterns && data.patterns.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-text-sub mb-2">구체적 패턴:</p>
                            <ul className="space-y-1">
                              {data.patterns.map((pattern, idx) => (
                                <li key={idx} className="text-sm text-text-main flex items-start gap-2">
                                  <span className={`${colors.text} mt-1`}>•</span>
                                  <span className="flex-1">{pattern}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 설명 */}
      <div className="mt-6 p-4 rounded-xl bg-orange-50 border border-orange-200">
        <p className="text-sm text-text-sub">
          <span className="font-semibold text-text-main">💡 아티팩트란?</span> 딥페이크 생성 과정에서 발생하는 
          인공적인 흔적들입니다. 공간적/시간적/구조적 아티팩트가 많이 발견될수록 딥페이크일 가능성이 높습니다.
        </p>
      </div>
    </div>
  );
}