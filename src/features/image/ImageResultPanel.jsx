import { useImageStore } from "../../store/image/imageStore.js";
import ImageResultPlaceholder from "./ImageResultPlaceholder";

export default function ImageResultPanel() {
  const { result } = useImageStore();

  return (
    <div className="relative rounded-[28px] bg-white/40 backdrop-blur-2xl border border-white/50 shadow-glass-soft p-14 min-h-[520px]">
      {!result && <ImageResultPlaceholder />}
    </div>
  );
}
