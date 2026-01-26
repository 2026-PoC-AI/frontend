import { forwardRef } from "react";
import AudioTimeline from "./AudioTimeline";
import RiskOverlayBar from "./RiskOverlayBar";

const AudioEvidenceSection = forwardRef(({ audioUrl, segments }, audioRef) => {
  const handleSeek = (time) => {
    if (!audioRef?.current) return;
    audioRef.current.currentTime = time;
    audioRef.current.play();
  };

  return (
    <section className="rounded-3xl bg-white/45 backdrop-blur-xl border border-white/60 p-8 space-y-8 shadow-[0_25px_70px_-30px_rgba(79,70,229,0.3)]">
      <header>
        <p className="text-[10px] font-black tracking-[0.4em] text-slate-500 uppercase mb-1">
          Evidence
        </p>
        <h2 className="text-lg font-black text-slate-800">오디오 증거 분석</h2>
      </header>

      <audio
        ref={audioRef}
        src={audioUrl}
        controls
        preload="metadata"
        className="w-full"
      />

      <RiskOverlayBar segments={segments} />

      <AudioTimeline segments={segments} onSeek={handleSeek} />
    </section>
  );
});

export default AudioEvidenceSection;
