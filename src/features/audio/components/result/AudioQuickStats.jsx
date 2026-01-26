function Stat({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 px-4 py-3">
      <p className="text-xs font-bold text-slate-500">{label}</p>
      <p className="font-black text-slate-800">{value}</p>
    </div>
  );
}

export default function AudioQuickStats({ result }) {
  return (
    <section className="rounded-3xl bg-white border border-slate-200 p-6">
      <h3 className="text-sm font-black text-slate-700 mb-4">분석 요약</h3>

      <div className="grid grid-cols-2 gap-4">
        <Stat label="판정" value={result.prediction} />
        <Stat label="기법" value={result.suspectedMethod} />
        <Stat
          label="조작 확률"
          value={`${Math.round(result.fakeProbability * 100)}%`}
        />
        <Stat label="모델" value={result.modelVersion} />
      </div>
    </section>
  );
}
