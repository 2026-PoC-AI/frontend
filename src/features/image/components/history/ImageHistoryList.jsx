export default function ImageHistoryList({ items, onOpen }) {
  return (
    <div className="space-y-4">
      {items.map((it) => (
        <div
          key={it.jobUuid}
          className="
            group
            rounded-[28px]
            bg-white/40 backdrop-blur-2xl
            border border-white/50
            px-8 py-6
            flex items-center justify-between gap-6
            hover:bg-white/60 hover:-translate-y-1
            transition-all duration-300 ease-out
            shadow-sm hover:shadow-xl hover:shadow-primary/5
          "
        >
          {/* LEFT: Info */}
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-bold text-text-main truncate group-hover:text-primary transition-colors">
              {it.filename}
            </p>
            <p className="text-[11px] text-text-soft/60 mt-1.5 tracking-wider font-medium">
              {it.createdAt ? new Date(it.createdAt).toLocaleString() : "—"}
            </p>
          </div>

          {/* CENTER: Status Badges */}
          <div className="flex items-center gap-3">
            <span className="px-4 py-1.5 rounded-full bg-white/40 border border-white/60 text-[10px] font-bold text-text-soft uppercase tracking-widest">
              {it.jobStatus}
            </span>
            <span
              className={`
                px-4 py-1.5 rounded-full border text-[10px] font-black tracking-widest
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
            className="
              shrink-0
              w-12 h-12
              flex items-center justify-center
              rounded-full
              bg-primary-dark text-white
              hover:scale-110 active:scale-95
              transition-all duration-300
              shadow-lg shadow-primary-dark/20
            "
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
