//시간대 위험 시각화
export default function AudioTimeline({ segments, onSeek }) {
  if (!segments?.length) return null;

  const total = Math.max(...segments.map((s) => s.endTime));

  return (
    <section className="space-y-3">
      <h3 className="text-sm font-bold text-slate-700">
        위험 구간 타임라인 (클릭 시 재생)
      </h3>

      <div className="relative h-14 rounded-xl bg-black/5 overflow-hidden">
        {segments.map((s, i) => {
          const left = (s.startTime / total) * 100;
          const width = ((s.endTime - s.startTime) / total) * 100;

          return (
            <button
              key={i}
              onClick={() => onSeek?.(s.startTime)}
              title={`${s.startTime}s`}
              className={`
                absolute top-2 h-10 rounded-xl
                transition hover:scale-y-110 cursor-pointer
                ${s.riskLevel === "high" ? "bg-red-400" : "bg-slate-400"}
              `}
              style={{ left: `${left}%`, width: `${width}%` }}
            />
          );
        })}
      </div>

      <p className="text-[11px] text-slate-500">
        위험 구간을 클릭하면 해당 시점부터 음성이 재생됩니다.
      </p>
    </section>
  );
}
