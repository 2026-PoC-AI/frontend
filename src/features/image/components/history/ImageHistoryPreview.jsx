import ImageRiskRing from "../viz/ImageRiskRing";

export default function ImageHistoryPreview({ result }) {
  const analysis = result?.results?.[0];
  if (!analysis) return null;

  const isFake = analysis.label === "FAKE";
  const themeColor = isFake ? "red" : "emerald";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* VERDICT BLOCK */}
      <div
        className={`
        relative overflow-hidden rounded-[32px] p-10 
        border border-${themeColor}-500/20 
        bg-gradient-to-br from-${themeColor}-500/[0.08] to-transparent
      `}
      >
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <p
              className={`text-[11px] font-black tracking-[0.3em] text-${themeColor}-500/60 uppercase mb-3`}
            >
              Verdict
            </p>
            <h3
              className={`text-6xl font-black tracking-tighter ${isFake ? "text-red-500" : "text-emerald-500"}`}
            >
              {analysis.label}
            </h3>
            <div className="mt-6 flex items-center justify-center md:justify-start gap-4">
              <div className="px-4 py-2 rounded-2xl bg-white/50 border border-white text-xs font-bold text-text-main shadow-sm">
                Confidence{" "}
                <span className="ml-1 text-primary">
                  {(analysis.confidence * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          <div className="relative">
            {/* 후광 효과 */}
            <div
              className={`absolute inset-0 blur-3xl opacity-20 bg-${themeColor}-500 rounded-full`}
            />
            <ImageRiskRing score={analysis.riskScore} variant="default" />
          </div>
        </div>
      </div>

      {/* INTERPRETATION */}
      <div className="rounded-[24px] bg-white/40 border border-white/60 p-8 shadow-glass-soft">
        <p className="text-[10px] font-black tracking-[0.2em] text-text-soft/60 uppercase mb-4">
          Analysis Summary
        </p>
        <p className="text-[16px] text-text-main leading-relaxed font-medium italic">
          "{analysis.interpretation}"
        </p>
      </div>

      {/* META INFO */}
      <div className="flex items-center justify-between px-4 text-[11px] font-bold text-text-soft/40 tracking-widest uppercase">
        <span>File: {result.input?.filename}</span>
        <span>Status: {result.job?.status}</span>
      </div>
    </div>
  );
}
