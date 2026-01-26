import { useRef, useState } from "react";

export default function ImageCompareSlider({
  beforeUrl,
  afterUrl,
  labelBefore = "ORIGINAL",
  labelAfter = "AFTER",
}) {
  const containerRef = useRef(null);
  const [ratio, setRatio] = useState(0.5);

  const onMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const next = Math.min(1, Math.max(0, x / rect.width));
    setRatio(next);
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={onMove}
      onMouseMove={(e) => e.buttons === 1 && onMove(e)}
      className="
        relative
        w-full
        max-w-full
        aspect-square
        max-h-[420px]
        mx-auto
        overflow-hidden
        rounded-xl
        select-none
        bg-black/5
      "
    >
      {/* BEFORE */}
      <img
        src={beforeUrl}
        alt={labelBefore}
        className="
          absolute inset-0
          w-full h-full
          object-contain
        "
        draggable={false}
      />

      {/* AFTER */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${ratio * 100}%` }}
      >
        <img
          src={afterUrl}
          alt={labelAfter}
          className="
            w-full h-full
            object-contain
          "
          draggable={false}
        />
      </div>

      {/* Divider */}
      <div
        className="absolute top-0 bottom-0 w-[2px] bg-white/80 z-10"
        style={{ left: `${ratio * 100}%` }}
      />

      {/* Handle */}
      <div
        className="absolute top-1/2 -translate-y-1/2 z-20"
        style={{ left: `${ratio * 100}%` }}
      >
        <div className="w-4 h-4 rounded-full bg-white shadow-md border border-black/10 -translate-x-1/2" />
      </div>

      {/* Labels */}
      <span className="absolute top-2 left-2 text-[10px] font-bold bg-black/50 text-white px-2 py-1 rounded">
        {labelBefore}
      </span>
      <span className="absolute top-2 right-2 text-[10px] font-bold bg-black/50 text-white px-2 py-1 rounded">
        {labelAfter}
      </span>
    </div>
  );
}
