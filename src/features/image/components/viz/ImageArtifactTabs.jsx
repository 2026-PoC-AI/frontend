import { useState } from "react";
import BoundingBoxOverlay from "./BoundingBoxOverlay";
import HeatmapOverlay from "./HeatmapOverlay";
import FaceCropGrid from "./FaceCropGrid";

const TABS = [
  { key: "bbox", label: "Face Region" },
  { key: "heatmap", label: "AI Attention" },
  { key: "faces", label: "Face Crops" },
];

export default function ImageArtifactTabs() {
  const [tab, setTab] = useState("bbox");

  return (
    <div className="mt-10 flex gap-6">
      {/* ================= LEFT TABS ================= */}
      <div className="w-40 shrink-0 space-y-2">
        {TABS.map((t) => {
          const active = tab === t.key;

          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`
                w-full text-left
                px-4 py-3 rounded-xl
                text-xs font-bold tracking-wide
                transition-all
                ${
                  active
                    ? "bg-primary/15 text-primary shadow-sm"
                    : "bg-white/30 text-text-soft hover:bg-white/50"
                }
              `}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* ================= RIGHT CONTENT ================= */}
      <div className="flex-1">
        {tab === "bbox" && <BoundingBoxOverlay />}
        {tab === "heatmap" && <HeatmapOverlay />}
        {tab === "faces" && <FaceCropGrid />}
      </div>
    </div>
  );
}
