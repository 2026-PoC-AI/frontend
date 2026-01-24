//앙상블 시각화 기반
export default function ModelVotePanel({ votes }) {
  return (
    <section>
      <h2 className="text-xl font-black mb-6">Model Decisions</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {votes.map((v, i) => (
          <div
            key={i}
            className="p-4 rounded-xl bg-white/5 border border-white/10"
          >
            <p className="font-bold">{v.modelName}</p>
            <p className="text-xs opacity-60">{v.modelType}</p>
            <p className="mt-2 text-sm">
              Fake: {(v.fakeProbability * 100).toFixed(1)}%
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
