//Timeline 상단 “위험 밀도 요약 바”
export default function RiskOverlayBar({ segments }) {
  if (!segments?.length) return null;

  const total = Math.max(...segments.map((s) => s.endTime));

  return (
    <section className="space-y-2">
      <h3 className="text-sm font-bold text-slate-700">위험 밀도 요약</h3>

      <div className="relative h-2 rounded-full bg-black/10 overflow-hidden">
        {segments.map((s, i) => {
          const left = (s.startTime / total) * 100;
          const width = ((s.endTime - s.startTime) / total) * 100;

          return (
            <div
              key={i}
              className="absolute top-0 h-full bg-red-400"
              style={{ left: `${left}%`, width: `${width}%` }}
            />
          );
        })}
      </div>
    </section>
  );
}
