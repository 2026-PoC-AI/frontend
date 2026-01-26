export default function ImageHistoryEmpty() {
  return (
    <div
      className="
        rounded-[32px]
        bg-white/35
        backdrop-blur-2xl
        border border-white/40
        px-10 py-14
        text-center
        shadow-glass-soft
      "
    >
      {/* Icon */}
      <div className="mb-6 flex justify-center">
        <div
          className="
            w-16 h-16
            rounded-2xl
            bg-white/40
            border border-white/50
            flex items-center justify-center
          "
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="text-text-soft"
          >
            {/* clock / history */}
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </svg>
        </div>
      </div>

      {/* Text */}
      <h3 className="text-lg font-bold text-text-main tracking-tight mb-2">
        아직 분석 기록이 없습니다
      </h3>

      <p className="text-sm text-text-soft leading-relaxed max-w-[240px] mx-auto">
        이미지를 분석하면 이곳에
        <br />
        신뢰 리포트가 차곡차곡 저장됩니다.
      </p>
    </div>
  );
}
