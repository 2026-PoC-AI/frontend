import { useImageStore } from "../../../../store/image/imageStore";
import ImageCompareSlider from "./ImageCompareSlider";

export default function HeatmapOverlay() {
  const result = useImageStore((s) => s.result);
  const faces = result?.artifacts?.filter((a) => a.type === "face_crop") ?? [];
  const heatmaps = result?.artifacts?.filter((a) => a.type === "heatmap") ?? [];
  const targetIdx = 0;
  const face = faces.find((x) => x.meta?.index === targetIdx) ?? faces[0];
  const hm = heatmaps.find((x) => x.meta?.index === targetIdx) ?? heatmaps[0];
  const input = result?.input;
  if (!heatmaps.length || !input) return null;
  if (!hm || !input?.url) return null;
  return (
    <div className="rounded-2xl bg-white/45 backdrop-blur-xl border border-white/35 p-6">
      <p className="text-xs tracking-widest text-text-soft mb-4">
        AI ATTENTION COMPARISON
      </p>

      <ImageCompareSlider
        beforeUrl={face.url}
        afterUrl={hm.url}
        labelBefore="FACE CROP"
        labelAfter="HEATMAP"
      />

      <p className="mt-3 text-[11px] text-text-soft">
        드래그하여 원본 이미지와 AI 주목 영역을 비교해보세요.
      </p>
    </div>
  );
}
