import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Video,
  X,
  Clock,
  AlertTriangle,
  Loader2,
  Upload,
  Film,
  ScanFace,
  Brain,
  FileCheck,
  CheckCircle,
} from "lucide-react";
import { analyzeVideo, getAnalysisProgress } from "../../../api/videoApi";

export function VideoUpload() {
  const navigate = useNavigate();

  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [videoMetadata, setVideoMetadata] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  const [progress, setProgress] = useState(0);
  const [progressStage, setProgressStage] = useState("");
  const [progressDetail, setProgressDetail] = useState("");

  const pollingIntervalRef = useRef(null);
  const currentAnalysisIdRef = useRef(null);
  const fileRef = useRef(null);

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
    if (droppedFile && droppedFile.type.startsWith("video/")) {
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

    if (
      !selectedFile.type.includes("mp4") &&
      !selectedFile.name.endsWith(".mp4")
    ) {
      setError(
        "현재 MP4 형식만 지원됩니다. 다른 형식의 파일을 MP4로 변환해주세요.",
      );
      return;
    }

    const maxSize = 50 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      setError("파일 크기는 50MB 이하여야 합니다.");
      return;
    }

    setFile(selectedFile);
    fileRef.current = selectedFile;

    const video = document.createElement("video");
    video.preload = "metadata";
    video.crossOrigin = "anonymous";

    const videoUrl = URL.createObjectURL(selectedFile);

    const generateThumbnail = () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const thumbnailUrl = canvas.toDataURL("image/jpeg", 0.8);
      setThumbnail(thumbnailUrl);
      URL.revokeObjectURL(videoUrl);
    };

    video.onloadedmetadata = () => {
      const duration = video.duration;

      if (duration > 60) {
        setError("영상 길이는 60초 이하여야 합니다.");
        setFile(null);
        URL.revokeObjectURL(videoUrl);
        return;
      }

      const size = (selectedFile.size / 1024 / 1024).toFixed(2);
      setVideoMetadata({
        duration: Math.round(duration),
        size: size + " MB",
      });

      video.currentTime = Math.min(1, duration / 2);
    };

    video.onseeked = () => {
      generateThumbnail();
    };

    video.onerror = () => {
      console.warn("metadata read failed, fallback mode");
      const size = (selectedFile.size / 1024 / 1024).toFixed(2);
      setVideoMetadata({
        duration: 0,
        size: size + " MB",
      });

      video.currentTime = 0;
      video.muted = true;
      video
        .play()
        .then(() => {
          setTimeout(() => {
            video.pause();
            generateThumbnail();
          }, 100);
        })
        .catch(() => {
          URL.revokeObjectURL(videoUrl);
        });
    };

    video.src = videoUrl;
  };

  const stopProgressPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    currentAnalysisIdRef.current = null;
  }, []);

  const startProgressPolling = useCallback(
    (analysisId) => {
      currentAnalysisIdRef.current = analysisId;

      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }

      const pollProgress = async () => {
        try {
          const progressData = await getAnalysisProgress(analysisId);

          if (!progressData) return;

          setProgress(progressData.progress || 0);
          setProgressStage(progressData.stage || "");
          setProgressDetail(progressData.detail || "");

          if (
            progressData.stage === "completed" &&
            progressData.progress === 100
          ) {
            if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current);
              pollingIntervalRef.current = null;
            }

            try {
              const apiUrl =
                import.meta.env.VITE_API_URL || "http://localhost:8080";
              const response = await fetch(
                `${apiUrl}/api/video/analysis/${analysisId}`,
              );

              if (!response.ok) {
                throw new Error("분석 결과 조회 실패");
              }

              const result = await response.json();

              setUploading(false);

              navigate("/video/results", {
                state: {
                  file: {
                    name: fileRef.current.name,
                    size: fileRef.current.size,
                  },
                  fileFromState: fileRef.current,
                  result,
                },
              });
            } catch (err) {
              console.error("결과 조회 실패:", err);
              setError("분석 결과를 불러오는데 실패했습니다.");
              setUploading(false);
            }
          }

          if (progressData.stage === "failed") {
            if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current);
              pollingIntervalRef.current = null;
            }

            setError("영상 분석에 실패했습니다.");
            setUploading(false);
          }
        } catch (err) {
          console.error("진행률 조회 실패:", err);
        }
      };

      pollProgress();
      pollingIntervalRef.current = setInterval(pollProgress, 1000);
    },
    [navigate],
  );

  useEffect(() => {
    return () => {
      stopProgressPolling();
    };
  }, [stopProgressPolling]);

  const handleAnalyze = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);
    setProgress(0);
    setProgressStage("video_upload");
    setProgressDetail("영상 업로드 준비 중...");

    try {
      const result = await analyzeVideo(file);

      if (result.analysisId) {
        if (result.status === "PROCESSING") {
          startProgressPolling(result.analysisId);
          return;
        }

        if (result.status === "COMPLETED") {
          setUploading(false);
          navigate("/video/results", {
            state: {
              file: {
                name: file.name,
                size: file.size,
              },
              fileFromState: file,
              result,
            },
          });
          return;
        }
      } else {
        throw new Error("분석 ID를 받지 못했습니다.");
      }
    } catch (err) {
      console.error("분석 요청 실패:", err);
      setError(
        err instanceof Error ? err.message : "분석 중 오류가 발생했습니다.",
      );
      setUploading(false);
      stopProgressPolling();
    }
  };

  const handleRemove = () => {
    setFile(null);
    fileRef.current = null;
    setVideoMetadata(null);
    setError(null);
    setThumbnail(null);
    setProgress(0);
    setProgressStage("");
    setProgressDetail("");
    stopProgressPolling();
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <main className="relative px-6 pt-10 pb-20 max-w-4xl mx-auto">
      <div className="text-center mb-8 relative shrink-0">
        <p className="text-[10px] font-black tracking-[0.4em] text-primary/60 mb-2 uppercase">
          VIDEO Inspector
        </p>
        <h1 className="text-3xl md:text-4xl font-black text-text-main mb-3 tracking-tight">
          Video Deepfake Detection
        </h1>
        <p className="text-text-sub max-w-lg mx-auto leading-relaxed opacity-70 text-sm">
          의심되는 영상 파일을 업로드하세요.
          <br className="hidden sm:block" />
          AI가 프레임별로 딥페이크 패턴을 분석합니다.
        </p>
      </div>

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
              className="w-full max-w-xl mx-auto p-8 rounded-[24px] bg-white/50 backdrop-blur-md border border-white/60 shadow-glass-soft text-center"
            >
              <div
                className={`border-2 border-dashed rounded-xl p-10 transition-colors ${
                  isDragging
                    ? "border-primary/60 bg-primary/5"
                    : "border-primary/30 hover:border-primary/60 hover:bg-primary/5"
                }`}
              >
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileSelect}
                  disabled={uploading}
                  className="hidden"
                  id="video-upload"
                />

                <label
                  htmlFor="video-upload"
                  className="cursor-pointer flex flex-col items-center gap-4"
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Video className="w-8 h-8 text-primary" />
                  </div>

                  <div>
                    <p className="text-lg font-bold text-text-main">
                      비디오 파일 업로드
                    </p>
                    <p className="text-sm text-text-sub mt-2">
                      MP4 (최대 50MB, 60초)
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
              <div className="flex items-start gap-4 mb-6">
                {thumbnail ? (
                  <div className="w-32 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={thumbnail}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-32 h-20 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Video className="w-8 h-8 text-primary/50" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-base sm:text-lg font-medium truncate text-text-main">
                        {file.name}
                      </p>

                      <div className="flex items-center gap-3 text-sm text-text-sub mt-1">
                        <span>{videoMetadata?.size || "Loading..."}</span>

                        {videoMetadata && (
                          <>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>
                                {formatDuration(videoMetadata.duration)}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {!uploading && (
                      <button
                        onClick={handleRemove}
                        className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors flex-shrink-0 text-text-sub"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {uploading && (
                <div className="space-y-4 mb-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-text-main">진행률</span>
                      <span className="text-primary font-bold">
                        {progress}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-primary-dark transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      {
                        key: "video_upload",
                        label: "영상 업로드 중",
                        icon: Upload,
                      },
                      {
                        key: "frame_extraction",
                        label: "프레임 추출 중",
                        icon: Film,
                      },
                      {
                        key: "face_detection",
                        label: "얼굴 검출 중",
                        icon: ScanFace,
                      },
                      {
                        key: "ai_analysis",
                        label: "AI 모델 분석 중",
                        icon: Brain,
                      },
                      {
                        key: "result_generation",
                        label: "결과 생성 중",
                        icon: FileCheck,
                      },
                    ].map((step) => {
                      const stageOrder = [
                        "video_upload",
                        "frame_extraction",
                        "face_detection",
                        "ai_analysis",
                        "result_generation",
                      ];
                      const currentIndex = stageOrder.indexOf(progressStage);
                      const stepIndex = stageOrder.indexOf(step.key);

                      const isActive = progressStage === step.key;
                      const isCompleted =
                        progressStage === "completed" ||
                        currentIndex > stepIndex;

                      const StepIcon = step.icon;

                      return (
                        <div
                          key={step.key}
                          className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                            isActive
                              ? "bg-primary/10 border-l-4 border-primary"
                              : isCompleted
                                ? "bg-green-50 border-l-4 border-green-500"
                                : "bg-gray-50"
                          }`}
                        >
                          <div
                            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                              isActive
                                ? "bg-primary text-white"
                                : isCompleted
                                  ? "bg-green-500 text-white"
                                  : "bg-gray-300 text-gray-600"
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle className="w-5 h-5" />
                            ) : isActive ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <StepIcon className="w-5 h-5" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p
                              className={`text-sm font-medium ${
                                isActive
                                  ? "text-primary"
                                  : isCompleted
                                    ? "text-green-600"
                                    : "text-gray-500"
                              }`}
                            >
                              {step.label}
                            </p>
                          </div>
                        </div>
                      );
                    })}
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
  );
}
