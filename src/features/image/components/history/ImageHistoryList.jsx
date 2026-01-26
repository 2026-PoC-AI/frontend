export default function ImageHistoryList({ items, onOpen }) {
  return (
    <div className="space-y-3">
      {items.map((it) => (
        <div
          key={it.jobUuid}
          className="
            group relative
            rounded-[24px]
            bg-white/45 backdrop-blur-2xl
            border border-white/50
            px-6 py-5
            flex items-center gap-5
            transition-all duration-300
            hover:bg-white/65
            hover:border-primary/30
            hover:shadow-[0_12px_32px_-12px_rgba(0,0,0,0.15)]
          "
        >
          {/* LEFT: Info */}
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-bold text-text-main truncate">
              {it.filename}
            </p>
            <p className="mt-1 text-[10px] tracking-widest text-text-soft/60 uppercase">
              {it.createdAt ? new Date(it.createdAt).toLocaleString() : "—"}
            </p>
          </div>

          {/* CENTER: Badges */}
          <div className="flex items-center gap-2">
            <span
              className="
              px-3 py-1 rounded-full
              bg-white/50 border border-white/60
              text-[9px] font-bold tracking-widest text-text-soft uppercase
            "
            >
              {it.jobStatus}
            </span>

            <span
              className={`
                px-3 py-1 rounded-full
                text-[9px] font-black tracking-widest uppercase
                border
                ${
                  it.overallRiskLevel === "HIGH"
                    ? "bg-red-500/10 text-red-500 border-red-500/20"
                    : it.overallRiskLevel === "LOW"
                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                      : "bg-amber-400/10 text-amber-500 border-amber-400/20"
                }
              `}
            >
              {it.overallRiskLevel ?? "—"}
            </span>
          </div>

          {/* RIGHT: Action */}
          <button
            onClick={() => onOpen(it.jobUuid)}
            aria-label="Open analysis"
            className="
              shrink-0
              w-11 h-11
              flex items-center justify-center
              rounded-full
              bg-white/60
              border border-white/60
              text-primary-dark
              transition-all
              hover:bg-primary/10
              hover:shadow-[0_0_0_4px_rgba(59,130,246,0.15)]
              active:scale-95
            "
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform group-hover:translate-x-0.5"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
