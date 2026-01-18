import { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Video, Upload, X, Clock } from 'lucide-react';

interface VideoMetadata {
    duration: number;
    size: string;
}

export function VideoUpload() {
    const navigate = useNavigate();
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [videoMetadata, setVideoMetadata] = useState<VideoMetadata | null>(null);

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
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-text-main mb-4 tracking-tight">
                        Video Deepfake Detection
                    </h1>
                    <p className="text-text-sub text-lg">
                        의심되는 영상 파일을 업로드하세요. <br className="hidden sm:block"/>
                        AI가 프레임별로 딥페이크 패턴을 분석하여 진위 여부를 판별합니다.
                    </p>
                </div>

                <div className="transition-all duration-500 ease-in-out">
                    {!file ? (
                        <div className="animate-fade-up">
                            <div 
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                className={`w-full max-w-xl mx-auto p-8 rounded-[24px] bg-white/50 backdrop-blur-md border border-white/60 shadow-glass-soft text-center`}
                            >
                                <div className={`border-2 border-dashed rounded-xl p-10 transition-colors ${
                                    isDragging 
                                        ? 'border-primary/60 bg-primary/5' 
                                        : 'border-primary/30 hover:border-primary/60 hover:bg-primary/5'
                                }`}>
                                    <input
                                        type="file"
                                        accept=".mp4,.avi,.mov,.mkv,video/*"
                                        onChange={handleFileSelect}
                                        disabled={uploading}
                                        className="hidden"
                                        id="video-upload"
                                    />
                                    <label
                                        htmlFor="video-upload"
                                        className="cursor-pointer flex flex-col items-center gap-4"
                                    >
                                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl">
                                            🎬
                                        </div>
                                        <div>
                                            <p className="text-lg font-bold text-text-main">비디오 파일 업로드</p>
                                            <p className="text-sm text-text-sub mt-2">
                                                MP4, AVI, MOV, MKV (최대 500MB)
                                            </p>
                                        </div>
                                        <span className="px-6 py-2 rounded-full bg-primary text-white font-medium hover:bg-primary-dark transition-colors">
                                            파일 선택하기
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full max-w-4xl mx-auto animate-fade-up space-y-6">
                            <div className="p-8 rounded-[24px] bg-white/60 backdrop-blur-md border border-white/60 shadow-glass-soft">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <Video className="w-6 h-6 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-base sm:text-lg font-medium truncate text-text-main">{file.name}</p>
                                            <div className="flex items-center gap-3 text-sm text-text-sub">
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
                                            className="ml-2 p-2 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors flex-shrink-0 text-text-sub"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>

                                {uploading && (
                                    <div className="space-y-3">
                                        <div className="h-2 bg-paper rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-primary transition-all duration-300"
                                                style={{ width: `${uploadProgress}%` }}
                                            />
                                        </div>
                                        <p className="text-sm sm:text-base text-text-sub text-center font-medium">
                                            업로드 중... {uploadProgress}%
                                        </p>
                                    </div>
                                )}

                                {!uploading && uploadProgress === 0 && (
                                    <button
                                        onClick={handleUpload}
                                        className="w-full px-8 py-3 rounded-full bg-primary text-white font-bold hover:bg-primary-dark transition-all shadow-lg hover:shadow-primary/30"
                                    >
                                        분석 시작
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}