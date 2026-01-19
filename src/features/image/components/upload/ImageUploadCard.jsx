import { useImageStore } from "../../../../store/image/imageStore.js";
import useImageUpload from "../../../../hooks/image/useImageUpload.js";
import { analyzeImage } from "../../../../api/imageApi.js";
import { createMockImageResult } from "../../mock/imageMockResult.js";
import useS3Upload from "../../../../hooks/s3/useS3Upload.js";

export default function ImageUploadCard() {
  const {
    file,
    previewUrl,
    isAnalyzing,
    setAnalyzing,
    setAnalysisId,
    setResult,
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

      // S3 업로드
      const s3Key = await uploadFile({
        file,
        domain: "image",
        stage: "inputs",
      });

      // 분석 요청
      const payload = {
        task: "deepfake_image",
        s3Key,
        filename: file.name,
        fileSize: file.size,
        mimeType: file.type,
      };

      const res = await analyzeImage(payload);
      setAnalysisId(res.analysisId);

      // (현재는 mock 결과 유지)
      setTimeout(() => {
        const mockResult = createMockImageResult({
          analysisId: res.analysisId,
          file,
        });
        setResult(mockResult);
        setAnalyzing(false);
        setStep("summary");
      }, 900);
    } catch (e) {
      console.error(e);
      alert("이미지 업로드 또는 분석 중 오류가 발생했습니다.");
      setAnalyzing(false);
    }
  };

  return (
    <div
      className={`
        relative
        rounded-[28px]
        bg-white/55
        backdrop-blur-2xl
        border border-white/60
        shadow-glass-strong
        p-12
        transition-all
        ${file ? "ring-2 ring-primary/30" : ""}
      `}
    >
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-text-main mb-1">
          이미지 업로드
        </h2>
        <p className="text-xs text-text-soft">
          JPG 또는 PNG 파일을 업로드하세요
        </p>
      </div>

      <div
        onClick={!file ? openFilePicker : undefined}
        onDrop={onDrop}
        onDragOver={onDragOver}
        className={`
          relative
          flex items-center justify-center
          rounded-[20px]
          px-10 py-14
          transition-all
          ${
            file
              ? "bg-primary-soft/40"
              : "border-2 border-dashed border-primary/30 hover:border-primary/60 hover:bg-primary-soft/30 cursor-pointer"
          }
        `}
      >
        {!file && (
          <div className="text-center">
            <p className="text-sm text-text-main/80 mb-2">
              클릭하거나 드래그하여 이미지 선택
            </p>
            <p className="text-xs text-text-soft">최대 파일 크기 20MB</p>
          </div>
        )}

        {file && (
          <>
            <img
              src={previewUrl}
              alt="preview"
              className="max-h-[220px] rounded-[16px] shadow-glass-soft"
            />

            <button
              onClick={(e) => {
                e.stopPropagation();
                reset();
              }}
              className="
                absolute top-4 right-4
                w-9 h-9
                rounded-full
                bg-white/80
                flex items-center justify-center
                shadow cursor-pointer
                hover:bg-white
              "
            >
              ✕
            </button>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png, image/jpeg"
        className="hidden"
        onChange={onFileChange}
      />

      <button
        onClick={handleAnalyze}
        disabled={!file || isAnalyzing}
        className={`
          mt-10 w-full py-4 rounded-pill text-sm font-medium transition-all
          ${
            file
              ? "bg-primary-dark/80 text-white hover:bg-primary-dark/90 cursor-pointer shadow-[0_12px_40px_rgba(53,124,234,0.22)]"
              : "bg-primary/30 text-white cursor-not-allowed"
          }
        `}
      >
        {isAnalyzing ? "분석 중..." : "이미지 분석 시작"}
      </button>
    </div>
  );
}
