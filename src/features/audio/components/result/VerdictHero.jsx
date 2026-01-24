//판정 + 확신도 + 기법
export default function VerdictHero({ result }) {
  const isFake = result.prediction === "fake";

  return (
    <section className="space-y-6">
      <h1
        className={`text-7xl font-black tracking-tight
          ${isFake ? "text-red-500" : "text-green-500"}
        `}
      >
        {isFake ? "FAKE VOICE" : "REAL VOICE"}
      </h1>

      <p className="text-lg opacity-80">This audio shows strong signs of</p>

      <p
        className={`text-2xl font-bold
        ${isFake ? "text-red-400" : "text-green-400"}
      `}
      >
        {result.suspectedMethod}
        {result.methodConfidence && (
          <> ({Math.round(result.methodConfidence * 100)}%)</>
        )}
      </p>
    </section>
  );
}
