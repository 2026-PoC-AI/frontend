export default function ImageAnalyzeSkeleton() {
  return (
    <div className="relative rounded-[28px] bg-white/45 backdrop-blur-xl p-14 overflow-hidden">
      {/* subtle glow */}
      <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-primary-mint/20 blur-3xl" />

      {/* header */}
      <div className="mb-10 text-center">
        <p className="text-xs tracking-widest text-text-soft mb-2">ANALYZING</p>
        <h3 className="text-lg font-semibold text-text-main">
          AI가 이미지를 분석하고 있어요
        </h3>
        <p className="text-xs text-text-soft mt-2">
          딥페이크 패턴과 신뢰 지표를 계산 중입니다
        </p>
      </div>

      {/* main skeleton */}
      <div className="flex flex-col lg:flex-row items-center gap-10 animate-pulse">
        {/* ring placeholder */}
        <div className="w-44 h-44 rounded-full bg-white/30 relative">
          <div className="absolute inset-0 rounded-full bg-white/20 blur-xl" />
        </div>

        {/* text skeleton */}
        <div className="flex-1 space-y-4 w-full">
          <div className="h-5 w-1/3 bg-white/30 rounded" />
          <div className="h-4 w-1/2 bg-white/30 rounded" />
          <div className="h-4 w-2/3 bg-white/30 rounded" />

          <div className="pt-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-4 bg-white/25 rounded" />
            ))}
          </div>
        </div>
      </div>

      {/* footer hint */}
      <div className="mt-10 text-center">
        <p className="text-xs text-text-soft">
          평균 분석 시간은 약 5–10초입니다
        </p>
      </div>
    </div>
  );
}
