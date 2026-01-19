export default function ImageHistoryList({ items, onOpen, onRemove }) {
  return (
    <div className="space-y-3">
      {items.map((it) => (
        <div
          key={it.jobUuid}
          className="rounded-2xl bg-white/45 backdrop-blur-xl border border-white/35 p-5 flex items-center justify-between gap-4"
        >
          <div className="min-w-0">
            <p className="text-sm text-text-main font-semibold truncate">
              {it.filename}
            </p>
            <p className="text-xs text-text-soft mt-1">
              {it.createdAt ? new Date(it.createdAt).toLocaleString() : "—"} ·{" "}
              {it.status} · {it.label} · {it.riskLevel} ({it.riskScore})
            </p>
          </div>

          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => onOpen(it.jobUuid)}
              className="px-4 py-2 rounded-pill bg-primary-dark/80 text-white text-xs hover:bg-primary-dark/90 transition"
            >
              열기
            </button>
            <button
              onClick={() => onRemove(it.jobUuid)}
              className="px-4 py-2 rounded-pill bg-white/60 text-text-main text-xs hover:bg-white/70 transition"
            >
              삭제
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
