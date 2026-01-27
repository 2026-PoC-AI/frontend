import { useState, useEffect, useRef } from "react";
import { AlertTriangle } from "lucide-react";

export function SuspiciousFrames({ frameAnalyses, onFrameClick, videoUrl }) {
    const [thumbnails, setThumbnails] = useState([]);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    // 상위 5개 의심 프레임 추출
    const topSuspiciousFrames = frameAnalyses
        .filter((f) => f.confidence > 60) // 60% 이상만
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 5);

    useEffect(() => {
        if (!videoUrl || topSuspiciousFrames.length === 0) {
            return;
        }

        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (!video || !canvas) {
            return;
        }

        const ctx = canvas.getContext("2d");

        const extractThumbnails = async () => {
            const extracted = [];

            for (let i = 0; i < topSuspiciousFrames.length; i++) {
                const frame = topSuspiciousFrames[i];

                await new Promise((resolve) => {
                    const seeked = () => {
                        video.removeEventListener("seeked", seeked);

                        canvas.width = video.videoWidth;
                        canvas.height = video.videoHeight;

                        ctx.drawImage(video, 0, 0);

                        const thumbnail = canvas.toDataURL("image/jpeg", 0.8);

                        extracted.push({
                            ...frame,
                            thumbnail,
                        });

                        resolve();
                    };

                    video.addEventListener("seeked", seeked);
                    video.currentTime = frame.timestamp;
                });
            }

            setThumbnails(extracted);
        };

        const handleLoadedMetadata = () => {
            extractThumbnails();
        };

        video.addEventListener("loadedmetadata", handleLoadedMetadata);

        // 이미 로드된 경우 대응
        if (video.readyState >= 1) {
            handleLoadedMetadata();
        }

        return () => {
            video.removeEventListener("loadedmetadata", handleLoadedMetadata);
        };
    }, [videoUrl, topSuspiciousFrames]);

    if (topSuspiciousFrames.length === 0) {
        return (
            <div className="p-8 rounded-[24px] bg-white/60 backdrop-blur-md border border-white/60 shadow-glass-soft text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-text-main mb-2">
                    의심 프레임 없음
                </h3>
                <p className="text-text-sub">
                    분석 결과 의심스러운 프레임이 발견되지 않았습니다
                </p>
            </div>
        );
    }

    return (
        <div className="p-8 rounded-[24px] bg-white/60 backdrop-blur-md border border-white/60 shadow-glass-soft">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-text-main">
                        가장 의심스러운 프레임
                    </h3>
                    <p className="text-sm text-text-sub">
                        신뢰도 상위 {topSuspiciousFrames.length}개 프레임
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {topSuspiciousFrames.map((frame, index) => {
                    const thumbnail = thumbnails.find(
                        (t) => t.frameNumber === frame.frameNumber
                    );

                    return (
                        <button
                            key={frame.frameNumber}
                            onClick={() => onFrameClick(frameAnalyses.indexOf(frame))}
                            className="group relative overflow-hidden rounded-xl border-2 border-white/60 hover:border-primary transition-all hover:shadow-lg"
                        >
                            {/* 썸네일 or 플레이스홀더 */}
                            <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center">
                                {thumbnail ? (
                                    <img
                                        src={thumbnail.thumbnail}
                                        alt={`Frame ${frame.frameNumber}`}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="text-center p-2">
                                        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                                        <p className="text-xs text-text-soft">로딩중...</p>
                                    </div>
                                )}
                            </div>

                            {/* 오버레이 */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                                <p className="text-white text-xs font-medium">
                                    프레임 #{frame.frameNumber}
                                </p>
                                <p className="text-white/80 text-xs">
                                    {frame.timestamp.toFixed(2)}초
                                </p>
                            </div>

                            {/* 신뢰도 배지 */}
                            <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-red-500 text-white text-xs font-bold shadow-lg">
                                {Math.round(frame.confidence)}%
                            </div>

                            {/* 순위 배지 */}
                            <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-white/90 flex items-center justify-center text-xs font-bold text-primary">
                                {index + 1}
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* 숨겨진 비디오/캔버스 */}
            <video
                ref={videoRef}
                src={videoUrl}
                className="hidden"
                muted
                playsInline
                crossOrigin="anonymous"
            />
            <canvas ref={canvasRef} className="hidden" />
        </div>
    );
}