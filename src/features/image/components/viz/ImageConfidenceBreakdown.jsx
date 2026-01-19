export default function ImageConfidenceBreakdown({ breakdown }) {
  const items = [
    { key: "faceConsistency", label: "Face Consistency" },
    { key: "textureAnomaly", label: "Texture Anomaly" },
    { key: "lightingMismatch", label: "Lighting Mismatch" },
  ];

  const safe = breakdown || {};

  const getColor = (v) =>
    v >= 70 ? "bg-red-500" : v >= 40 ? "bg-yellow-400" : "bg-green-400";

  return (
    <div className="rounded-2xl bg-white/45 backdrop-blur-xl border border-white/35 p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs tracking-widest text-text-soft">
          SIGNAL BREAKDOWN
        </p>
        <p className="text-xs text-text-soft">higher = more suspicious</p>
      </div>

      <div className="space-y-3">
        {items.map((it) => {
          const v = Math.max(0, Math.min(100, Number(safe[it.key] ?? 0)));
          return (
            <div key={it.key} className="space-y-1">
              <div className="flex justify-between text-xs text-text-soft">
                <span>{it.label}</span>
                <span className="text-text-main/80 font-medium">{v}</span>
              </div>

              <div className="h-2.5 rounded-full bg-white/35 overflow-hidden">
                <div
                  className={`h-full ${getColor(v)} rounded-full`}
                  style={{
                    width: `${v}%`,
                    transition: "width 700ms cubic-bezier(.2,.9,.2,1)",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
