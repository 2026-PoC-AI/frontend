import { useNavigate } from "react-router-dom";
import { useImageStore } from "../../store/image/imageStore";
import ImageUploadCard from "../../features/image/components/upload/ImageUploadCard";
import ImageResultSummary from "../../features/image/components/result/ImageResultSummary";
import ImageFinalReport from "../../features/image/components/report/ImageFinalReport";
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
    <main className="relative px-6 pt-10 pb-10 max-w-5xl mx-auto flex flex-col h-full">
      <header className="text-center mb-8 relative shrink-0">
        <button
          onClick={() => nav("/image/history")}
          className="absolute right-0 top-0 px-6 py-2.5 rounded-full bg-white/40 backdrop-blur-md border border-white/60 text-primary text-[11px] font-black tracking-widest hover:bg-white/60 transition-all shadow-sm active:scale-95"
        >
          HISTORY
        </button>
        <p className="text-[10px] font-black tracking-[0.4em] text-primary/60 mb-2 uppercase">
          IMAGE Inspector
        </p>
        <h1 className="text-4xl md:text-5xl font-black text-text-main mb-3 tracking-tight">
          Image Analysis
        </h1>
        <p className="text-text-sub max-w-lg mx-auto leading-relaxed opacity-70 text-sm">
          이미지가 생성되었거나 조작되었는지 정밀 분석합니다.
        </p>
      </header>

      <div className="mb-8 shrink-0">
        <ImageProgress />
      </div>

      <div className="relative flex-1 min-h-125 animate-in fade-in slide-in-from-bottom-8 duration-1000">
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
