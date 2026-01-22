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
    <div className="mt-10 space-y-6">
      {/* Tabs */}
      <div className="flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`
              px-4 py-2 rounded-full text-xs font-bold tracking-widest transition
              ${
                tab === t.key
                  ? "bg-primary-dark text-white shadow"
                  : "bg-white/30 text-text-soft hover:bg-white/50"
              }
            `}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === "bbox" && <BoundingBoxOverlay />}
      {tab === "heatmap" && <HeatmapOverlay />}
      {tab === "faces" && <FaceCropGrid />}
    </div>
  );
}
