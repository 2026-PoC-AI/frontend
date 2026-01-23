import { useImageStore } from "../../../../store/image/imageStore";
import ImageResultPlaceholder from "./ImageResultPlaceholder";
import ImageResultSummary from "./ImageResultSummary";
import ImageFinalReport from "../report/ImageFinalReport";

export default function ImageResultPanel() {
  const { result, isAnalyzing, viewMode } = useImageStore();

  return (
    <div className="relative rounded-[28px] bg-white/40 backdrop-blur-2xl border border-white/50 shadow-glass-soft p-14 min-h-[520px] overflow-hidden">
      {/* subtle background glow */}
      <div className="pointer-events-none absolute -top-20 -right-24 w-72 h-72 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-primary-mint/18 blur-3xl" />

      {isAnalyzing && !result && (
        <div className="h-full flex flex-col items-center justify-center gap-5">
          <div className="relative">
            <div className="animate-spin w-10 h-10 border-2 border-primary border-t-transparent rounded-full" />
            <div className="absolute inset-0 rounded-full blur-xl bg-primary/15" />
          </div>
          <div className="text-center">
            <p className="text-sm text-text-main/80">
              AI가 이미지를 분석 중입니다
            </p>
            <p className="text-xs text-text-soft mt-1">잠시만 기다려주세요…</p>
          </div>
        </div>
      )}

      {!isAnalyzing && !result && <ImageResultPlaceholder />}

      {!isAnalyzing && result && viewMode === "summary" && (
        <ImageResultSummary />
      )}

      {!isAnalyzing && result && viewMode === "report" && <ImageFinalReport />}
    </div>
  );
}
