import React from "react";

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export default function HighlightedText({ text, highlights }) {
  const safeText = text ?? "";
  const items = Array.isArray(highlights) ? [...highlights] : [];

  // start 기준 정렬
  items.sort((a, b) => (a.start ?? 0) - (b.start ?? 0));

  const parts = [];
  let cursor = 0;

  for (let i = 0; i < items.length; i += 1) {
    const h = items[i];
    if (!h) continue;

    const start = clamp(Number(h.start ?? 0), 0, safeText.length);
    const end = clamp(Number(h.end ?? 0), 0, safeText.length);
    if (end <= start) continue;

    // 겹치면 skip (MVP 안전장치)
    if (start < cursor) continue;

    if (cursor < start) {
      parts.push({
        type: "plain",
        text: safeText.slice(cursor, start),
        key: `p-${cursor}-${start}`,
      });
    }

    parts.push({
      type: "hl",
      text: safeText.slice(start, end),
      weight: Number(h.weight ?? 0),
      key: `h-${start}-${end}-${i}`,
    });

    cursor = end;
  }

  if (cursor < safeText.length) {
    parts.push({
      type: "plain",
      text: safeText.slice(cursor),
      key: `p-${cursor}-${safeText.length}`,
    });
  }

  if (parts.length === 0) {
    return (
      <pre className="whitespace-pre-wrap break-words text-sm leading-relaxed text-text-main/80 font-noto">
        {safeText}
      </pre>
    );
  }

  return (
    <div className="text-sm leading-relaxed text-text-main/80 font-noto whitespace-pre-wrap break-words">
      {parts.map((p) => {
        if (p.type === "plain") return <span key={p.key}>{p.text}</span>;

        // weight 기반 강조(0~1). Tailwind로는 가변 색을 못 주니 opacity로 처리.
        const opacity = Math.max(0.15, Math.min(0.55, (p.weight || 0) * 0.6));
        return (
          <mark
            key={p.key}
            className="rounded px-1 py-0.5"
            style={{
              backgroundColor: `rgba(99, 102, 241, ${opacity})`, // indigo 느낌
              color: "rgba(17, 24, 39, 0.95)",
            }}
            title={`weight: ${Number(p.weight ?? 0).toFixed(2)}`}
          >
            {p.text}
          </mark>
        );
      })}
    </div>
  );
}
