import { useImageStore } from "../../../../store/image/imageStore";

export default function FaceCropGrid() {
  const result = useImageStore((s) => s.result);
  const faces = result?.artifacts?.filter((a) => a.type === "face_crop") ?? [];
  console.log("ARTIFACTS", result?.artifacts);
  if (!faces.length) return null;

  return (
    <div className="rounded-2xl bg-white/45 backdrop-blur-xl border border-white/35 p-6">
      <p className="text-xs tracking-widest text-text-soft mb-4">
        DETECTED FACE REGIONS
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {faces.map((f, i) => (
          <img
            key={i}
            src={f.url}
            alt={`face-${i}`}
            className="rounded-lg object-cover border border-white/40 shadow"
          />
        ))}
      </div>

      <p className="mt-3 text-[11px] text-text-soft">
        얼굴 영역별 분석을 통해 합성 여부를 평가합니다.
      </p>
    </div>
  );
}
