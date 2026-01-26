import ConfidenceGauge from "./ConfidenceGauge";

export default function AudioHeroSection({ result }) {
  const isFake = result.prediction === "fake";

  return (
    <section
      className="
        relative overflow-hidden
        px-2 py-4
      "
    >
      {/* ambient */}
      <div
        className={`
          pointer-events-none absolute inset-0
        `}
      />

      <div className="relative flex flex-col items-center text-center space-y-10">
        {/* HEADER */}
        <div className="space-y-3">
          <p className="text-[11px] font-black tracking-[0.45em] text-slate-500 uppercase">
            Audio AI Analysis
          </p>

          <h1
            className={`text-6xl md:text-7xl font-black tracking-tight ${
              isFake ? "text-red-500" : "text-indigo-600"
            }`}
          >
            {isFake ? "FAKE VOICE" : "REAL VOICE"}
          </h1>

          <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            음성 파형, 주파수, 위상 왜곡을 기반으로 AI가 종합 분석한 결과입니다.
          </p>
        </div>

        {/* GAUGE */}
        <ConfidenceGauge confidence={result.confidence} />

        {/* META */}
        <div className="flex flex-wrap justify-center gap-3">
          <MetaBadge label="추정 기법" value={result.suspectedMethod} />

          {result.methodConfidence != null && (
            <MetaBadge
              label="기법 신뢰도"
              value={`${Math.round(result.methodConfidence * 100)}%`}
            />
          )}
        </div>
      </div>
    </section>
  );
}

function MetaBadge({ label, value }) {
  return (
    <div className="px-5 py-2 rounded-full bg-white/70 backdrop-blur border border-white/80 text-xs font-bold text-slate-700 shadow-sm">
      {label}: <span className="text-indigo-600">{value}</span>
    </div>
  );
}
