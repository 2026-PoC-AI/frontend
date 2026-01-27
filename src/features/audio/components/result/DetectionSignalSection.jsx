export default function DetectionSignalSection({ reasons }) {
  if (!reasons?.length) return null;

  return (
    <section className="rounded-3xl bg-white border border-slate-200 p-8">
      <h2 className="text-lg font-black text-slate-800 mb-6">
        탐지된 이상 신호
      </h2>

      <ul className="space-y-4">
        {reasons.map((r, i) => (
          <li
            key={i}
            className="flex items-center justify-between rounded-xl bg-slate-50 px-5 py-4"
          >
            <div>
              <p className="font-semibold text-slate-800">{r.description}</p>
              <p className="text-xs text-slate-500 mt-1">
                신호 신뢰도 {Math.round(r.confidence * 100)}%
              </p>
            </div>

            <span className="text-xs font-bold text-red-500 bg-red-50 px-3 py-1 rounded-full">
              위험
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
