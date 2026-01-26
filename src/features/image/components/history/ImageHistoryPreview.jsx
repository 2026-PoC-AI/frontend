import ImageRiskRing from "../viz/ImageRiskRing";

export default function ImageHistoryPreview({ result }) {
  const analysis = result?.results?.[0];
  if (!analysis) return null;

  const isFake = analysis.label === "FAKE";
  const themeColor = isFake ? "red" : "emerald";

  return (
    <div className="space-y-6">
      {/* VERDICT */}
      <div
        className={`
          rounded-[24px] p-6
          border border-${themeColor}-500/20
          bg-gradient-to-br from-${themeColor}-500/[0.06] to-transparent
        `}
      >
        <div className="flex items-center justify-between gap-6">
          <div>
            <p
              className={`text-[10px] font-black tracking-[0.3em] text-${themeColor}-500/60 uppercase mb-2`}
            >
              Verdict
            </p>
            <h3
              className={`text-3xl font-black tracking-tight ${isFake ? "text-red-500" : "text-emerald-500"}`}
            >
              {analysis.label}
            </h3>

            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 border border-white text-[11px] font-bold text-text-main">
              Confidence
              <span className="text-primary">
                {(analysis.confidence * 100).toFixed(1)}%
              </span>
            </div>
          </div>

          <div className="scale-[0.85]">
            <ImageRiskRing score={analysis.riskScore} variant="compact" />
          </div>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="rounded-[20px] bg-white/40 border border-white/60 p-5">
        <p className="text-[10px] font-black tracking-[0.2em] text-text-soft/60 uppercase mb-2">
          Summary
        </p>
        <p className="text-sm text-text-main leading-relaxed">
          {analysis.interpretation}
        </p>
      </div>

      {/* META */}
      <div className="flex justify-between px-1 text-[10px] font-bold text-text-soft/40 tracking-widest uppercase">
        <span>{result.input?.filename}</span>
        <span>{result.job?.status}</span>
      </div>
    </div>
  );
}
