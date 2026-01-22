import { useImageStore } from "../../../../store/image/imageStore";
import ImageCompareSlider from "./ImageCompareSlider";

export default function BoundingBoxOverlay() {
  const result = useImageStore((s) => s.result);

  const boxes = result?.artifacts?.filter((a) => a.type === "bbox") ?? [];
  const input = result?.input;
  console.log("ARTIFACTS", result?.artifacts);
  if (!boxes.length || !input) return null;

  const boxImg = boxes[0];

  return (
    <div className="rounded-2xl bg-white/45 backdrop-blur-xl border border-white/35 p-6">
      <p className="text-xs tracking-widest text-text-soft mb-4">
        FACE REGION DETECTION
      </p>

      <ImageCompareSlider
        beforeUrl={input.url}
        afterUrl={boxImg.url}
        labelBefore="ORIGINAL"
        labelAfter="FACE BBOX"
      />

      <p className="mt-3 text-[11px] text-text-soft">
        AI가 얼굴로 인식한 영역을 원본 이미지와 비교합니다.
      </p>
    </div>
  );
}
