import { useLocation, useNavigate } from "react-router-dom";
import { useRef, useEffect } from "react";
import useAudioResultPoll from "../../store/audio/useAudioResultPoll";

import VerdictHero from "../../features/audio/components/result/VerdictHero";
import ConfidenceGauge from "../../features/audio/components/result/ConfidenceGauge";
import EvidencePlayer from "../../features/audio/components/viz/EvidencePlayer";
import RiskOverlayBar from "../../features/audio/components/viz/RiskOverlayBar";
import DetectionReasonList from "../../features/audio/components/result/DetectionReasonList";
import ModelVotePanel from "../../features/audio/components/result/ModelVotePanel";

export default function AudioResultPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const audioRef = useRef(null);

  const audioFileId = state?.audioFileId;
  const { result, status, error } = useAudioResultPoll(audioFileId);

  useEffect(() => {
    if (!audioFileId) navigate("/audio");
  }, [audioFileId, navigate]);

  if (!audioFileId) return null;

  if (status === "PROCESSING") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <p className="text-sm text-text-soft animate-pulse">
          Analyzing waveform & spectral anomalies…
        </p>
      </div>
    );
  }

  if (status === "FAILED") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center space-y-4">
        <h1 className="text-2xl font-black text-red-500">Analysis Failed</h1>
        <p className="text-sm text-text-soft">
          {error || "Please try again later."}
        </p>
        <button
          onClick={() => navigate("/audio")}
          className="px-6 py-3 rounded-full bg-primary text-white font-bold"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!result) return null;

  return (
    <main className="min-h-screen px-8 pt-20 pb-40">
      {/* HERO */}
      <section className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-10">
          <VerdictHero result={result} />
          <ConfidenceGauge confidence={result.confidence} />
        </div>

        {/* QUICK STATS */}
        <div className="grid grid-cols-2 gap-6">
          <StatCard label="Prediction" value={result.prediction} />
          <StatCard label="Method" value={result.suspectedMethod} />
          <StatCard
            label="Fake Probability"
            value={`${Math.round(result.fakeProbability * 100)}%`}
          />
          <StatCard label="Model Version" value={result.modelVersion} />
        </div>
      </section>

      {/* PLAYER + EVIDENCE */}
      <section className="max-w-7xl mx-auto mt-28 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <EvidencePlayer
            ref={audioRef}
            audioUrl={result.audioUrl}
            segments={result.suspiciousSegments}
          />
        </div>

        <DetectionReasonList reasons={result.reasons} />
      </section>

      {/* RISK */}
      <section className="max-w-7xl mx-auto mt-28">
        <RiskOverlayBar segments={result.suspiciousSegments} />
      </section>

      {/* MODELS */}
      <section className="max-w-7xl mx-auto mt-28">
        <ModelVotePanel votes={result.modelVotes} />
      </section>
    </main>
  );
}
function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl bg-white/10 border border-white/15 p-6">
      <p className="text-xs opacity-60">{label}</p>
      <p className="text-xl font-black mt-1">{value}</p>
    </div>
  );
}
