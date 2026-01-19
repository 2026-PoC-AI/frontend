import { useImageStore } from "../../../../store/image/imageStore";

const steps = ["upload", "analyze", "summary", "report"];
const labels = {
  upload: "UPLOAD",
  analyze: "ANALYZE",
  summary: "SUMMARY",
  report: "REPORT",
};

export default function ImageProgress() {
  const { step } = useImageStore();
  const current = steps.indexOf(step);

  return (
    <div className="flex items-center justify-center gap-6 mb-12">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-3">
          <div
            className={`
              w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold
              ${
                i <= current
                  ? "bg-primary text-white shadow"
                  : "bg-white/40 text-text-soft"
              }
            `}
          >
            {i + 1}
          </div>
          <span
            className={`text-xs tracking-widest ${
              i <= current ? "text-text-main" : "text-text-soft"
            }`}
          >
            {labels[s]}
          </span>
          {i < steps.length - 1 && (
            <div className="w-8 h-[1px] bg-white/40 mx-2" />
          )}
        </div>
      ))}
    </div>
  );
}
