//정식 버전 핵심 UX
export default function SuspiciousSegmentList({ segments, onSeek }) {
  return (
    <section>
      <h2 className="text-xl font-black mb-6">Suspicious Segments</h2>

      <div className="space-y-4">
        {segments.map((s, i) => (
          <div
            key={i}
            onClick={() => onSeek(s.startTime)}
            className="cursor-pointer flex justify-between p-4 rounded-xl bg-white/60 border hover:bg-primary/5 transition"
          >
            <div>
              <p className="font-bold">
                {s.startTime}s – {s.endTime}s
              </p>
              <p className="text-sm text-text-sub">{s.reason}</p>
              <p className="text-xs text-text-soft">
                {s.indicators.join(", ")}
              </p>
            </div>

            <span
              className={`px-3 py-1 text-xs font-black rounded-full ${
                s.riskLevel === "high"
                  ? "bg-red-100 text-red-600"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {s.riskLevel.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
