import { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Video, X, Clock, AlertTriangle } from 'lucide-react';
import { analyzeVideo } from '../api/videoApi';

export function VideoUpload() {
    const navigate = useNavigate();
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [videoMetadata, setVideoMetadata] = useState(null);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && droppedFile.type.startsWith('video/')) {
            processFile(droppedFile);
        }
    }, []);

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            processFile(selectedFile);
        }
    };

    const processFile = (selectedFile) => {
        setError(null);
        
        console.log('File type:', selectedFile.type);
        console.log('File name:', selectedFile.name);
        
        // MP4만 허용하도록 체크
        if (!selectedFile.type.includes('mp4') && !selectedFile.name.endsWith('.mp4')) {
            setError('현재 MP4 형식만 지원됩니다. 다른 형식의 파일을 MP4로 변환해주세요.');
            return;
        }
        
        // 파일 크기 체크 (50MB 제한)
        const maxSize = 50 * 1024 * 1024;
        if (selectedFile.size > maxSize) {
            setError('파일 크기는 50MB 이하여야 합니다.');
            return;
        }
        
        setFile(selectedFile);
        
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
            window.URL.revokeObjectURL(video.src);
            const duration = video.duration;
            
            // 영상 길이 체크 (60초 제한)
            if (duration > 60) {
                setError('영상 길이는 60초 이하여야 합니다.');
                setFile(null);
                return;
            }
            
            const size = (selectedFile.size / 1024 / 1024).toFixed(2);
            
            setVideoMetadata({
                duration: Math.round(duration),
                size: size + ' MB',
            });
        };
        video.onerror = () => {
            // metadata 파싱 실패는 딥페이크 영상에서 정상 케이스
            console.warn('metadata read failed, fallback mode');

            const size = (selectedFile.size / 1024 / 1024).toFixed(2);

            setVideoMetadata({
                duration: 0, // unknown
                size: size + ' MB',
            });
        };
        video.src = URL.createObjectURL(selectedFile);
    };

    const handleAnalyze = async () => {
        if (!file) return;
    
        setUploading(true);
        setError(null);
    
        try {
            // 백엔드 API 호출
            const result = await analyzeVideo(file);
            
            const navigationState = {
                file: {
                    name: file.name,
                    size: file.size,
                },
                fileFromState: file,  // File 객체 추가 (VideoResults의 useEffect에서 사용)
                result: result
            };
            
            // 결과 페이지로 이동
            navigate('/video/results', { 
                state: navigationState
            });
            
        } catch (err) {
            console.error('분석 에러:', err);
            setError(err instanceof Error ? err.message : '분석 중 오류가 발생했습니다.');
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = () => {
        setFile(null);
        setVideoMetadata(null);
        setError(null);
    };

    const formatDuration = (seconds) => {
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

                {/* 에러 메시지 */}
                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center gap-3 max-w-xl mx-auto">
                        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm">{error}</p>
                    </div>
                )}

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
                                                MP4, AVI, MOV, MKV (최대 50MB, 60초)
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
                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center justify-center gap-3">
                                            <div className="inline-block w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                                            <p className="text-sm sm:text-base text-text-sub font-medium">
                                                AI가 영상을 분석하고 있습니다...
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {!uploading && (
                                    <button
                                        onClick={handleAnalyze}
                                        disabled={!videoMetadata}
                                        className="w-full px-8 py-3 rounded-full bg-primary text-white font-bold hover:bg-primary-dark transition-all shadow-lg hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
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