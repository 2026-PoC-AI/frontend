import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Film, Cpu, CheckCircle2, Clock } from 'lucide-react';
import { Progress } from '../../../components/ui/Progress';

interface AnalysisStep {
    id: string;
    label: string;
    status: 'pending' | 'processing' | 'completed';
    icon: React.ElementType;
}

const analysisSteps: AnalysisStep[] = [
    { id: 'upload', label: '영상 업로드 중', status: 'pending', icon: Film },
    { id: 'extract', label: '프레임 추출 중', status: 'pending', icon: Film },
    { id: 'analyze', label: 'AI 모델 분석 중', status: 'pending', icon: Cpu },
    { id: 'detect', label: '딥페이크 패턴 탐지 중', status: 'pending', icon: Cpu },
    { id: 'finalize', label: '결과 생성 중', status: 'pending', icon: CheckCircle2 },
];

export function VideoProgress() {
    const navigate = useNavigate();
    const [steps, setSteps] = useState(analysisSteps);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const stepDuration = 3000;
        const totalSteps = steps.length;

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
    }, [navigate, steps.length]);

    useEffect(() => {
        setSteps((prevSteps) =>
            prevSteps.map((step, index) => {
                if (index < currentStepIndex) {
                    return { ...step, status: 'completed' };
                } else if (index === currentStepIndex) {
                    return { ...step, status: 'processing' };
                }
                return { ...step, status: 'pending' };
            })
        );

        setProgress(((currentStepIndex + 1) / steps.length) * 100);
    }, [currentStepIndex, steps.length]);

    const handleSkip = () => {
        navigate('/video/results');
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#33C3AD] to-[#9CEFE2] rounded-full mb-4">
                        <Loader2 className="w-10 h-10 text-white animate-spin" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold mb-2">영상 분석 중</h2>
                    <p className="text-base sm:text-lg text-gray-600">
                        AI가 영상을 분석하고 있습니다. 잠시만 기다려주세요.
                    </p>
                </div>

                <div className="mb-8">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>진행률</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-3" />
                </div>

                <div className="space-y-4">
                    {steps.map((step) => {
                        const StepIcon = step.icon;
                        const isCompleted = step.status === 'completed';
                        const isProcessing = step.status === 'processing';
                        const isPending = step.status === 'pending';

                        return (
                            <div
                                key={step.id}
                                className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
                                    isProcessing
                                        ? 'bg-gradient-to-r from-[#33C3AD]/10 to-[#9CEFE2]/10 border-2 border-[#33C3AD]'
                                        : isCompleted
                                        ? 'bg-green-50 border border-green-200'
                                        : 'bg-gray-50 border border-gray-200'
                                }`}
                            >
                                <div
                                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                        isProcessing
                                            ? 'bg-gradient-to-br from-[#33C3AD] to-[#9CEFE2]'
                                            : isCompleted
                                            ? 'bg-green-500'
                                            : 'bg-gray-300'
                                    }`}
                                >
                                    {isProcessing ? (
                                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                                    ) : isCompleted ? (
                                        <CheckCircle2 className="w-6 h-6 text-white" />
                                    ) : (
                                        <StepIcon className="w-6 h-6 text-white" />
                                    )}
                                </div>

                                <div className="flex-1">
                                    <p
                                        className={`text-base sm:text-lg ${
                                            isProcessing ? 'font-semibold text-[#33C3AD]' : isCompleted ? 'text-green-700' : 'text-gray-500'
                                        }`}
                                    >
                                        {step.label}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {isProcessing && '처리 중...'}
                                        {isCompleted && '완료'}
                                        {isPending && '대기 중'}
                                    </p>
                                </div>

                                {isProcessing && (
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Clock className="w-4 h-4" />
                                        <span>약 3초</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-white text-xs font-bold">i</span>
                        </div>
                        <div>
                            <p className="text-sm text-blue-900">
                                <strong>분석 중 안내:</strong> 영상 길이에 따라 분석 시간이 달라질 수 있습니다. 
                                현재 AI 모델이 프레임별로 딥페이크 패턴을 탐지하고 있습니다.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-4 text-center">
                    <button
                        onClick={handleSkip}
                        className="text-sm text-gray-500 hover:text-gray-700 underline"
                    >
                        건너뛰기 (테스트용)
                    </button>
                </div>
            </div>
        </div>
    );
}