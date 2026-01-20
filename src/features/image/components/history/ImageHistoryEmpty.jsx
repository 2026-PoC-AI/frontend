export default function ImageHistoryEmpty() {
  return (
    <div className="rounded-[40px] bg-white/40 backdrop-blur-3xl border border-white/60 p-20 text-center shadow-glass-soft transition-all">
      <div className="mb-8 flex justify-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center border border-primary/10">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            className="text-primary/60"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </div>
      </div>

      <h3 className="text-xl font-bold text-text-main/90 mb-3 tracking-tight">
        아직 분석 히스토리가 없어요
      </h3>
      <p className="text-sm text-text-soft/70 max-w-[200px] mx-auto leading-relaxed">
        이미지를 분석하면 이곳에 <br />
        결과가 아름답게 기록됩니다.
      </p>
    </div>
  );
}
