//신뢰도 폭발 포인트
export default function DetectionReasonList({ reasons }) {
  return (
    <section className="rounded-3xl bg-red-500/5 border border-red-500/20 p-8 space-y-6">
      <h2 className="text-xl font-black">Detection Evidence</h2>

      <ul className="space-y-4">
        {reasons.map((r, i) => (
          <li key={i} className="space-y-1">
            <p className="font-semibold text-red-300">⚠ {r.description}</p>
            <p className="text-xs opacity-60">
              Confidence: {Math.round(r.confidence * 100)}%
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
