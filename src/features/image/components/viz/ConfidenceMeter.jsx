// src/features/image/components/result/viz/ConfidenceMeter.jsx
export default function ConfidenceMeter({ confidence }) {
  const percent = (confidence * 100).toFixed(1);

  return (
    <div className="rounded-3xl bg-white/45 backdrop-blur-xl border border-white/35 p-6">
      <p className="text-xs tracking-widest text-text-soft mb-4">
        MODEL CONFIDENCE
      </p>

      <div className="relative h-4 rounded-full bg-white/30 overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-primary transition-all duration-1000"
          style={{ width: `${percent}%` }}
        />
      </div>

      <p className="mt-4 text-3xl font-extrabold text-text-main">{percent}%</p>

      <p className="text-xs text-text-soft mt-1">
        AI 모델이 이 판단에 대해 갖는 확신 수준입니다.
      </p>
    </div>
  );
}
