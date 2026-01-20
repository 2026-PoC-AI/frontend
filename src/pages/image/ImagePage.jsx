import { useNavigate } from "react-router-dom";
import { useImageStore } from "../../store/image/imageStore";
import ImageUploadCard from "../../features/image/components/upload/ImageUploadCard";
import ImageResultSummary from "../../features/image/components/result/ImageResultSummary";
import ImageFinalReport from "../../features/image/components/result/ImageFinalReport";
import ImageProgress from "../../features/image/components/result/ImageProgress";
import ImageAnalyzeSkeleton from "../../features/image/components/viz/ImageAnalyzeSkeleton";
import useImageResultPoll from "../../hooks/image/useImageResultPoll";
function Stage({ active, children, scale = false }) {
  return (
    <div
      className={`
        absolute inset-0 transition-all duration-700 ease-[cubic-bezier(.2,.9,.2,1)]
        ${
          active
            ? `opacity-100 translate-x-0 ${
                scale ? "scale-100" : ""
              } pointer-events-auto`
            : "opacity-0 translate-x-12 scale-95 pointer-events-none"
        }
      `}
    >
      {children}
    </div>
  );
}

export default function ImagePage() {
  const { step } = useImageStore();
  useImageResultPoll();
  const nav = useNavigate();
  return (
    <main className="relative px-6 pt-20 pb-32 max-w-4xl mx-auto overflow-hidden">
      <header className="text-center mb-10 relative">
        <button
          onClick={() => nav("/image/history")}
          className="absolute right-0 top-2 px-4 py-2 rounded-pill bg-primary-deep/60 text-text-white text-xs hover:bg-primary-dark/50 transition"
        >
          히스토리
        </button>
        <h1 className="text-5xl font-extrabold text-text-main mb-4">
          Image Analysis
        </h1>
        <p className="text-text-sub">
          이미지가 AI로 생성되었거나 조작되었는지 분석합니다.
        </p>
      </header>

      <ImageProgress />

      <div className="relative h-[720px]">
        <Stage active={step === "upload"}>
          <ImageUploadCard />
        </Stage>

        <Stage active={step === "analyze"}>
          <ImageAnalyzeSkeleton />
        </Stage>

        <Stage active={step === "summary"} scale>
          <ImageResultSummary />
        </Stage>

        <Stage active={step === "report"} scale>
          <ImageFinalReport />
        </Stage>
      </div>
    </main>
  );
}
