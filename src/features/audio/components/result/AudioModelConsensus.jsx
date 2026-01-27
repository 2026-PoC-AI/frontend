export default function AudioModelConsensus({ votes }) {
  if (!votes?.length) return null;

  const avg = votes.reduce((s, v) => s + v.fakeProbability, 0) / votes.length;

  return (
    <section className="rounded-3xl bg-white border border-slate-200 p-8 space-y-6">
      <h3 className="text-lg font-black text-slate-800">모델 합의 결과</h3>

      <p className="text-sm text-slate-600">
        전체 모델 평균 조작 확률:{" "}
        <span className="font-black text-red-500">
          {(avg * 100).toFixed(1)}%
        </span>
      </p>

      <div className="space-y-4">
        {votes.map((v, i) => {
          const percent = Math.round(v.fakeProbability * 100);

          return (
            <div key={i} className="rounded-xl bg-slate-50 px-5 py-4">
              <div className="flex justify-between items-center">
                <p className="font-bold text-slate-800">{v.modelName}</p>
                <span className="font-black text-red-500">{percent}%</span>
              </div>

              <div className="mt-2 h-2 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-red-400"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
