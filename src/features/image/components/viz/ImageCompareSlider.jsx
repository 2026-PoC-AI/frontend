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
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const next = Math.min(1, Math.max(0, x / rect.width));
    setRatio(next);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-xl overflow-hidden select-none"
      onMouseMove={(e) => e.buttons === 1 && onMove(e)}
      onMouseDown={onMove}
    >
      {/* BEFORE */}
      <img src={beforeUrl} alt="before" className="w-full object-contain" />

      {/* AFTER */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${ratio * 100}%` }}
      >
        <img
          src={afterUrl}
          alt="after"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Divider */}
      <div
        className="absolute top-0 bottom-0 w-[2px] bg-white/80"
        style={{ left: `${ratio * 100}%` }}
      />

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
