import { useImageStore } from "../../store/image/imageStore";
import ImageResultPlaceholder from "./ImageResultPlaceholder";

export default function ImageResultPanel() {
  const { result, isAnalyzing } = useImageStore();

  return (
    <div className="relative rounded-[28px] bg-white/40 backdrop-blur-2xl border border-white/50 shadow-glass-soft p-14 min-h-[520px]">
      {/* 분석 중 */}
      {isAnalyzing && (
        <div className="w-full h-full flex items-center justify-center text-text-soft">
          분석 중입니다...
        </div>
      )}

      {/* 분석 전 */}
      {!isAnalyzing && !result && <ImageResultPlaceholder />}

      {/* 분석 완료 (임시 출력) */}
      {!isAnalyzing && result && (
        <pre className="text-xs text-text-main">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
