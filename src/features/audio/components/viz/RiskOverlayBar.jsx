//Timeline 상단 “위험 밀도 요약 바”
export default function RiskOverlayBar({ segments }) {
  if (!segments?.length) return null;

  const total = Math.max(...segments.map((s) => s.endTime));

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-black">Risk Density</h2>

      <div className="relative h-3 rounded-full bg-white/10 overflow-hidden">
        {segments.map((s, i) => {
          const left = (s.startTime / total) * 100;
          const width = ((s.endTime - s.startTime) / total) * 100;

          return (
            <div
              key={i}
              className={`absolute top-0 h-full
                ${
                  s.riskLevel === "high"
                    ? "bg-red-500 animate-pulse"
                    : "bg-green-400 opacity-40"
                }
              `}
              style={{ left: `${left}%`, width: `${width}%` }}
            />
          );
        })}
      </div>

      <p className="text-xs opacity-60">
        Highlighted segments indicate detected manipulation risk
      </p>
    </section>
  );
}
