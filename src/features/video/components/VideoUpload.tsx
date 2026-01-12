import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Upload, X, CheckCircle2, ArrowLeft, Lock, Zap, Target, Clock } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Progress } from '../../../components/ui/Progress';

export function VideoUpload() {
    const navigate = useNavigate();
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [videoMetadata, setVideoMetadata] = useState<{
        duration: number;
        size: string;
    } | null>(null);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && droppedFile.type.startsWith('video/')) {
            processFile(droppedFile);
        }
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            processFile(selectedFile);
        }
    };

    const processFile = (selectedFile: File) => {
        setFile(selectedFile);
        
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
            window.URL.revokeObjectURL(video.src);
            const duration = video.duration;
            const size = (selectedFile.size / 1024 / 1024).toFixed(2);
            
            setVideoMetadata({
                duration: Math.round(duration),
                size: size + ' MB',
            });
        };
        video.src = URL.createObjectURL(selectedFile);
    };

    const handleUpload = () => {
        if (!file) return;

        setUploading(true);
        setUploadProgress(0);

        const interval = setInterval(() => {
            setUploadProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        setUploading(false);
                        navigate('/video/analyzing', { state: { file } });
                    }, 500);
                    return 100;
                }
                return prev + 10;
            });
        }, 200);
    };

    const handleRemove = () => {
        setFile(null);
        setVideoMetadata(null);
        setUploadProgress(0);
        setUploading(false);
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        /* 배경 회색 제거: bg-white로 통일 */
        <div className="max-w-4xl mx-auto px-4 py-8 bg-white min-h-screen">
            {/* 최상단 줄: 메인으로 돌아가기 버튼 단독 배치 */}
            <div className="flex justify-start mb-12">
                <Button 
                    variant="ghost" 
                    onClick={() => navigate('/')}
                    className="hover:bg-gray-100"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    메인으로 돌아가기
                </Button>
            </div>

            {/* 두 번째 줄: 로고와 타이틀 한 줄 배치 */}
            <div className="flex items-center justify-center gap-6 mb-12">
                <div className="flex-shrink-0 inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#33C3AD] to-[#9CEFE2] rounded-2xl shadow-sm">
                    <Video className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <div className="text-left">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 text-gray-900">비디오 파일 업로드</h2>
                    <p className="text-base sm:text-lg text-gray-500">영상 속 조작된 콘텐츠를 검증합니다</p>
                </div>
            </div>

            <div className="max-w-2xl mx-auto">
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    /* 배경 회색 제거 및 테두리 조정 */
                    className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 transition-all duration-300 ${
                        isDragging
                            ? 'border-[#33C3AD] bg-[#33C3AD]/5'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                >
                    {!file ? (
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-[#33C3AD]/10 rounded-full mb-6">
                                <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-[#33C3AD]" />
                            </div>
                            
                            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-800">파일을 드래그하거나 클릭하여 업로드</h3>
                            <p className="text-sm sm:text-base text-gray-400 mb-8">
                                지원 형식: .mp4, .avi, .mov, .mkv<br />
                                최대 크기: 500MB
                            </p>
                            
                            <label>
                                <Button
                                    className="bg-[#33C3AD] hover:bg-[#2bb09c] text-white text-base sm:text-lg px-8 py-6 rounded-xl transition-colors"
                                >
                                    파일 선택
                                </Button>
                                <input
                                    type="file"
                                    accept=".mp4,.avi,.mov,.mkv,video/*"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* 파일 정보 바 배경색 조정 */}
                            <div className="flex items-center justify-between border border-gray-100 rounded-2xl p-4 shadow-sm">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="w-12 h-12 bg-[#33C3AD]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Video className="w-6 h-6 text-[#33C3AD]" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-base sm:text-lg font-medium truncate text-gray-800">{file.name}</p>
                                        <div className="flex items-center gap-3 text-sm text-gray-400">
                                            <span>{videoMetadata?.size || 'Loading...'}</span>
                                            {videoMetadata && (
                                                <>
                                                    <span>•</span>
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        <span>{formatDuration(videoMetadata.duration)}</span>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                                {!uploading && (
                                    <button
                                        onClick={handleRemove}
                                        className="ml-2 p-2 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors flex-shrink-0 text-gray-400"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                )}
                            </div>

                            {uploading && (
                                <div className="space-y-3">
                                    <Progress value={uploadProgress} className="h-2 bg-gray-100" />
                                    <p className="text-sm sm:text-base text-gray-500 text-center font-medium">
                                        업로드 중... {uploadProgress}%
                                    </p>
                                </div>
                            )}

                            {uploadProgress === 100 && (
                                <div className="flex items-center justify-center gap-2 text-[#33C3AD] text-base sm:text-lg font-semibold py-2">
                                    <CheckCircle2 className="w-5 h-5" />
                                    <span>업로드 완료!</span>
                                </div>
                            )}

                            {!uploading && uploadProgress === 0 && (
                                <Button
                                    onClick={handleUpload}
                                    className="w-full bg-[#33C3AD] hover:bg-[#2bb09c] text-white text-lg sm:text-xl py-7 rounded-2xl shadow-lg shadow-[#33C3AD]/20 transition-all active:scale-[0.98]"
                                >
                                    분석 시작
                                </Button>
                            )}
                        </div>
                    )}
                </div>

                {/* 하단 카드 섹션: 배경 회색 제거 및 border로 구분 */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
                    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center transition-hover hover:shadow-md">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-xl mb-3">
                            <Zap className="w-6 h-6 text-blue-500" />
                        </div>
                        <p className="text-sm sm:text-base font-medium text-gray-700">평균 2초 내 분석</p>
                    </div>
                    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center transition-hover hover:shadow-md">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-50 rounded-xl mb-3">
                            <Lock className="w-6 h-6 text-emerald-500" />
                        </div>
                        <p className="text-sm sm:text-base font-medium text-gray-700">안전한 암호화</p>
                    </div>
                    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center transition-hover hover:shadow-md">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-cyan-50 rounded-xl mb-3">
                            <Target className="w-6 h-6 text-cyan-500" />
                        </div>
                        <p className="text-sm sm:text-base font-medium text-gray-700">99.9% 정확도</p>
                    </div>
                </div>
            </div>
        </div>
    );
}