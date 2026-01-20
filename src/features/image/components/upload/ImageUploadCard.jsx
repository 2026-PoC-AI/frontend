import { useImageStore } from "../../../../store/image/imageStore.js";
import useImageUpload from "../../../../hooks/image/useImageUpload.js";
import { analyzeImage } from "../../../../api/imageApi.js";
import useS3Upload from "../../../../hooks/s3/useS3Upload.js";

export default function ImageUploadCard() {
  const {
    file,
    previewUrl,
    isAnalyzing,
    setAnalyzing,
    setAnalysisId,
    setStep,
  } = useImageStore();
  const { inputRef, openFilePicker, onFileChange, onDrop, onDragOver, reset } =
    useImageUpload();
  const { uploadFile } = useS3Upload();

  const handleAnalyze = async () => {
    if (!file || isAnalyzing) return;

    try {
      setAnalyzing(true);
      setStep("analyze");

      const s3Key = await uploadFile({
        file,
        domain: "image",
        stage: "inputs",
      });

      const payload = {
        task: "deepfake_image",
        s3Key,
        filename: file.name,
        fileSize: file.size,
        mimeType: file.type,
      };

      const res = await analyzeImage(payload);
      setAnalysisId(res.analysisId);
    } catch (e) {
      console.error(e);
      alert("이미지 업로드 또는 분석 중 오류가 발생했습니다.");
      setAnalyzing(false);
    }
  };

  return (
    <div
      className={`
        relative mx-auto max-w-xl w-full
        rounded-[32px]
        bg-white/40
        backdrop-blur-3xl
        border border-white/60
        shadow-[0_24px_48px_-12px_rgba(0,0,0,0.08)]
        p-8 md:p-10
        transition-all duration-500
        ${file ? "ring-1 ring-primary/10" : ""}
      `}
    >
      {/* Header: 컴팩트하게 조정 */}
      <div className="mb-6 text-center">
        <h2 className="text-xl font-black text-text-main mb-1 tracking-tight">
          이미지 업로드
        </h2>
        <p className="text-[10px] font-bold text-text-soft/50 tracking-widest uppercase">
          JPG, PNG, WEBP (MAX 20MB)
        </p>
      </div>

      {/* Upload Zone: 높이를 가변적으로 변경 (min-h-[260px]) */}
      <div
        onClick={!file ? openFilePicker : undefined}
        onDrop={onDrop}
        onDragOver={onDragOver}
        className={`
          relative overflow-hidden
          flex items-center justify-center
          rounded-[24px]
          min-h-[260px]
          transition-all duration-300
          ${
            file
              ? "bg-white/20 shadow-inner"
              : "border-2 border-dashed border-primary/10 hover:border-primary/30 bg-primary/5 hover:bg-primary/10 cursor-pointer"
          }
        `}
      >
        {!file && (
          <div className="text-center group p-6">
            <div className="w-14 h-14 rounded-full bg-white/80 shadow-sm flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="text-primary"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
              </svg>
            </div>
            <p className="text-sm font-bold text-text-main/70 mb-1">
              파일을 드래그하거나 클릭하세요
            </p>
            <p className="text-[10px] text-text-soft/40 font-medium tracking-tight">
              분석할 이미지를 선택해주세요
            </p>
          </div>
        )}

        {file && (
          <div className="p-2 w-full h-full flex items-center justify-center relative group">
            <img
              src={previewUrl}
              alt="preview"
              className="max-h-[240px] w-auto object-contain rounded-xl shadow-xl transition-transform group-hover:scale-[1.01] duration-500"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                reset();
              }}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center shadow-lg hover:bg-black transition-all active:scale-90 text-xs backdrop-blur-md"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileChange}
      />

      {/* Button: 컴팩트한 상단 여백 (mt-8) */}
      <button
        onClick={handleAnalyze}
        disabled={!file || isAnalyzing}
        className={`
          mt-8 w-full py-4 rounded-[18px] text-[13px] font-black tracking-widest uppercase transition-all
          ${
            file
              ? "bg-primary-dark text-white hover:bg-black shadow-[0_12px_24px_rgba(0,0,0,0.12)] active:scale-[0.98]"
              : "bg-black/5 text-text-soft/30 cursor-not-allowed border border-black/5"
          }
        `}
      >
        {isAnalyzing ? "Analyzing..." : "Start Analysis"}
      </button>
    </div>
  );
}
