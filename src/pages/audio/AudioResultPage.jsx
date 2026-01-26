/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import useAudioResultPoll from "../../store/audio/useAudioResultPoll";

import AudioHeroSection from "../../features/audio/components/result/AudioHeroSection";
import DetectionSignalSection from "../../features/audio/components/result/DetectionSignalSection";
import AudioQuickStats from "../../features/audio/components/result/AudioQuickStats";
import AudioModelConsensus from "../../features/audio/components/result/AudioModelConsensus";
import AudioEvidenceSection from "../../features/audio/components/viz/AudioEvidenceSection";

/* ===== Scroll Item Animation ===== */

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 60,
    scale: 0.96,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function AudioResultPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const audioRef = useRef(null);

  const audioFileId = state?.audioFileId;
  const { result, status, error } = useAudioResultPoll(audioFileId);

  /* ===== 접근 보호 ===== */
  useEffect(() => {
    if (!audioFileId) navigate("/audio");
  }, [audioFileId, navigate]);

  /* ===== 분석 중 ===== */
  if (status === "PROCESSING") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-white to-indigo-100">
        <div className="rounded-3xl bg-white/50 backdrop-blur-xl border border-white/60 px-10 py-8 text-center shadow-[0_20px_60px_-20px_rgba(99,102,241,0.25)]">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-slate-600">
            음성 파형과 주파수 패턴을 분석 중입니다…
          </p>
        </div>
      </div>
    );
  }

  /* ===== 분석 실패 ===== */
  if (status === "FAILED") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-white to-indigo-100">
        <div className="rounded-3xl bg-white/50 backdrop-blur-xl border border-white/60 px-10 py-8 text-center space-y-4 shadow-[0_20px_60px_-20px_rgba(239,68,68,0.25)]">
          <h1 className="text-xl font-black text-red-500">
            분석에 실패했습니다
          </h1>
          <p className="text-sm text-slate-600">
            {error || "잠시 후 다시 시도해주세요."}
          </p>

          <button
            onClick={() => navigate("/audio")}
            className="
              mt-4 px-6 py-3 rounded-full
              bg-indigo-600 text-white font-bold
              hover:bg-indigo-500 transition
              active:scale-95
            "
          >
            다시 시도하기
          </button>
        </div>
      </div>
    );
  }

  if (!result) return null;

  /* ===== 정상 결과 ===== */
  return (
    <main className="min-h-screen px-6 py-8">
      {/* Top Action Bar */}
      <div className="max-w-6xl mx-auto flex items-center">
        {/* Back Button */}
        <button
          onClick={() => navigate("/audio")}
          className="
            flex items-center gap-2
            px-5 py-2.5 rounded-full
            text-primary-teal font-bold text-xs
            shadow-sm
            hover:bg-primary-mint/15
            hover:shadow
            transition
            active:scale-95
          "
        >
          ← 새 음성 분석
        </button>
      </div>

      {/* Page Entrance Animation */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.7,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="max-w-6xl mx-auto space-y-14"
      >
        {/* HERO */}
        <AudioHeroSection result={result} />

        {/* MAIN GRID */}
        <section className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
          {/* LEFT */}
          <div className="space-y-10">
            {/* Evidence */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              className="rounded-3xl bg-white/45 backdrop-blur-xl border border-white/60 p-8 shadow-[0_20px_60px_-20px_rgba(99,102,241,0.25)]"
            >
              <AudioEvidenceSection
                ref={audioRef}
                audioUrl={result.audioUrl}
                segments={result.suspiciousSegments}
              />
            </motion.div>

            {/* Detection Signal */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
            >
              <DetectionSignalSection reasons={result.reasons} />
            </motion.div>
          </div>

          {/* RIGHT */}
          <aside className="space-y-8 lg:sticky lg:top-10">
            {/* Quick Stats */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
            >
              <AudioQuickStats result={result} />
            </motion.div>

            {/* Model Consensus */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
            >
              <AudioModelConsensus votes={result.modelVotes} />
            </motion.div>
          </aside>
        </section>
      </motion.div>
    </main>
  );
}
