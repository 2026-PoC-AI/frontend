// src/features/image/components/result/viz/RiskDistributionBar.jsx
export default function RiskDistributionBar({ score }) {
  return (
    <div className="rounded-3xl bg-white/45 backdrop-blur-xl border border-white/35 p-6">
      <p className="text-xs tracking-widest text-text-soft mb-4">
        RISK DISTRIBUTION
      </p>

      <div className="h-3 rounded-full bg-white/30 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-red-500 transition-all duration-1000"
          style={{ width: `${score}%` }}
        />
      </div>

      <div className="flex justify-between text-[10px] text-text-soft mt-3">
        <span>LOW</span>
        <span>MEDIUM</span>
        <span>HIGH</span>
      </div>

      <p className="mt-4 text-sm font-bold text-text-main">
        Risk Score: <span className="text-primary">{score}</span> / 100
      </p>
    </div>
  );
}
