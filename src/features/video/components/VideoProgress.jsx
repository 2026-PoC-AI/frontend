import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

const analysisSteps = [
    { id: 'upload', label: '영상 업로드 중', icon: '📤' },
    { id: 'extract', label: '프레임 추출 중', icon: '🎞️' },
    { id: 'analyze', label: 'AI 모델 분석 중', icon: '🤖' },
    { id: 'detect', label: '딥페이크 패턴 탐지 중', icon: '🔍' },
    { id: 'finalize', label: '결과 생성 중', icon: '✅' },
];

export function VideoProgress() {
    const navigate = useNavigate();
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const stepDuration = 3000;
        const totalSteps = analysisSteps.length;

        const interval = setInterval(() => {
            setCurrentStepIndex((prev) => {
                const next = prev + 1;
                if (next >= totalSteps) {
                    clearInterval(interval);
                    setTimeout(() => {
                        navigate('/video/results');
                    }, 500);
                    return prev;
                }
                return next;
            });
        }, stepDuration);

        return () => clearInterval(interval);
    }, [navigate]);

    useEffect(() => {
        setProgress(((currentStepIndex + 1) / analysisSteps.length) * 100);
    }, [currentStepIndex]);

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
            <main className="relative z-10 px-6 pt-10 pb-20 max-w-4xl mx-auto">
                <div className="text-center py-20 animate-fade-up">
                    <div className="inline-block w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-6"></div>
                    <h2 className="text-2xl font-bold text-text-main mb-2">딥페이크 분석 중...</h2>
                    <p className="text-text-sub">AI가 프레임별로 딥페이크 패턴을 분석하고 있습니다.</p>
                </div>

                <div className="w-full max-w-2xl mx-auto animate-fade-up space-y-8">
                    {/* 진행률 바 */}
                    <div className="p-8 rounded-[24px] bg-white/60 backdrop-blur-md border border-white/60 shadow-glass-soft">
                        <div className="mb-4">
                            <div className="flex justify-between text-sm text-text-sub mb-2">
                                <span>진행률</span>
                                <span>{Math.round(progress)}%</span>
                            </div>
                            <div className="h-3 bg-paper rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-primary transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>

                        {/* 분석 단계 */}
                        <div className="space-y-3 mt-6">
                            {analysisSteps.map((step, idx) => {
                                const isCompleted = idx < currentStepIndex;
                                const isProcessing = idx === currentStepIndex;
                                const isPending = idx > currentStepIndex;

                                return (
                                    <div
                                        key={step.id}
                                        className={`p-4 rounded-xl transition-all duration-300 ${
                                            isProcessing
                                                ? 'bg-primary/10 border-2 border-primary'
                                                : isCompleted
                                                ? 'bg-green-50 border border-green-200'
                                                : 'bg-paper/50 border border-primary/10'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="text-2xl">{step.icon}</div>
                                            <div className="flex-1">
                                                <p className={`text-base ${
                                                    isProcessing ? 'font-semibold text-primary' : 
                                                    isCompleted ? 'text-green-700' : 
                                                    'text-text-sub'
                                                }`}>
                                                    {step.label}
                                                </p>
                                                <p className="text-sm text-text-soft">
                                                    {isProcessing && '처리 중...'}
                                                    {isCompleted && '완료'}
                                                    {isPending && '대기 중'}
                                                </p>
                                            </div>
                                            {isProcessing && (
                                                <div className="inline-block w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                                            )}
                                            {isCompleted && (
                                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* 안내 메시지 */}
                    <div className="p-6 rounded-xl bg-blue-50 border border-blue-100 text-blue-900">
                        <div className="flex items-start gap-3">
                            <div className="text-xl">ℹ️</div>
                            <div>
                                <p className="text-sm">
                                    <strong>분석 중 안내:</strong> 영상 길이에 따라 분석 시간이 달라질 수 있습니다. 
                                    현재 AI 모델이 프레임별로 딥페이크 패턴을 탐지하고 있습니다.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="text-center">
                        <button
                            onClick={() => navigate('/video/results')}
                            className="text-sm text-text-sub hover:text-text-main underline underline-offset-4"
                        >
                            건너뛰기 (테스트용)
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}