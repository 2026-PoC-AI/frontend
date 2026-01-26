// src/features/image/components/result/viz/AIInsightCard.jsx
export default function AIInsightCard({ text }) {
  return (
    <div className="rounded-[32px] bg-white/40 backdrop-blur-xl border border-white/60 p-10 shadow-glass-soft">
      <p className="text-[11px] font-black tracking-[0.35em] text-primary/60 uppercase mb-4">
        AI INSIGHT
      </p>

      <p className="text-[16px] text-text-main leading-relaxed italic">
        “{text}”
      </p>

      <p className="mt-6 text-xs text-text-soft">
        ※ 위 해석은 모델의 내부 판단 근거를 요약한 설명입니다.
      </p>
    </div>
  );
}
