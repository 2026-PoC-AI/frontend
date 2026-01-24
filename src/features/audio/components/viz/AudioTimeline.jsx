//시간대 위험 시각화
export default function AudioTimeline({
  segments,
  onPreviewStart,
  onPreviewEnd,
}) {
  if (!segments?.length) return null;

  const total = Math.max(...segments.map((s) => s.endTime));

  return (
    <section>
      <h2 className="text-xl font-black mb-6">Risk Timeline</h2>

      <div className="relative h-20 rounded-2xl bg-white/60 border p-4">
        {segments.map((seg, i) => {
          const left = (seg.startTime / total) * 100;
          const width = ((seg.endTime - seg.startTime) / total) * 100;

          const color =
            seg.riskLevel === "high"
              ? "bg-red-400"
              : seg.riskLevel === "medium"
                ? "bg-yellow-400"
                : "bg-green-400";

          return (
            <div
              key={i}
              className={`absolute top-4 h-8 rounded-lg ${color} cursor-pointer
                transition-opacity hover:opacity-80`}
              style={{ left: `${left}%`, width: `${width}%` }}
              title={seg.reason}
              onMouseEnter={() => onPreviewStart?.(seg.startTime)}
              onMouseLeave={() => onPreviewEnd?.()}
            />
          );
        })}
      </div>

      <p className="text-xs text-text-soft mt-3">
        Hover to preview · Click segments below to jump
      </p>
    </section>
  );
}
