//재생 + 밀도 업
import { forwardRef } from "react";
import AudioTimeline from "./AudioTimeline";

const EvidencePlayer = forwardRef(({ audioUrl, segments }, ref) => {
  if (!audioUrl) {
    return (
      <div className="rounded-2xl bg-white/10 border p-6 text-sm opacity-60">
        Audio source unavailable
      </div>
    );
  }

  return (
    <section className="rounded-3xl bg-white/10 border border-white/15 p-8 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black">Audio Evidence</h2>
        <span className="text-xs opacity-60">Original Upload</span>
      </div>

      <audio
        ref={ref}
        src={audioUrl}
        controls
        preload="metadata"
        className="w-full"
      />

      <AudioTimeline segments={segments} />
    </section>
  );
});

export default EvidencePlayer;
