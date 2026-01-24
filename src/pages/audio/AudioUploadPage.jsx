/* eslint-disable no-unused-vars */
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { uploadAudio, analyzeAudio } from "../../api/audioApi";
import useS3Upload from "../../hooks/s3/useS3Upload";

export default function AudioUploadPage() {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const navigate = useNavigate();
  const { uploadFile } = useS3Upload();

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);

    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type.startsWith("audio/")) {
      setFile(dropped);
    }
  };

  const handleSelect = (e) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  const handleAnalyze = async () => {
    if (!file || isAnalyzing) return;

    try {
      setIsAnalyzing(true);

      const s3Key = await uploadFile({
        file,
        domain: "audio",
        stage: "inputs",
      });

      const uploadRes = await uploadAudio({
        s3Key,
        file,
      });

      const audioFileId = uploadRes.audioFileId;

      await analyzeAudio(audioFileId);

      navigate("/audio/result", {
        state: { audioFileId },
      });
    } catch (err) {
      console.error("Audio analysis failed:", err);
      alert("오디오 분석 중 오류가 발생했습니다.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <main className="relative px-6 pt-10 pb-10 max-w-4xl mx-auto flex items-center justify-center text-center">
      <section className="relative z-10 w-full max-w-xl">
        {/* Header */}
        <p className="text-[10px] font-black tracking-[0.4em] text-primary/60 mb-2">
          AUDIO INSPECTOR
        </p>
        <h1 className="text-4xl md:text-5xl font-black text-text-main mb-3">
          Voice Authenticity Scan
        </h1>
        <p className="text-sm text-text-sub mb-10">
          AI가 음성 파형과 주파수 패턴을 분석하여
          <br />
          조작 여부를 탐지합니다.
        </p>

        {/* Upload Booth */}
        <div className="transition-all duration-500 ease-in-out">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={` animate-fade-up
            rounded-[32px] p-10 backdrop-blur-xl
            border border-white/60 shadow-glass-strong
            transition-all duration-300
            ${dragging ? "bg-primary/10 scale-[1.02]" : "bg-white/50"}
          `}
          >
            {/* Mic + Waveform */}
            <div className="flex flex-col items-center gap-6 mb-10">
              <motion.div
                animate={{ scale: file ? 1 : [1, 1.05, 1] }}
                transition={{
                  repeat: file ? 0 : Infinity,
                  duration: 2.5,
                  ease: "easeInOut",
                }}
                className="w-20 h-20 rounded-full bg-primary/15 flex items-center justify-center text-3xl"
              >
                🎙️
              </motion.div>

              {!file && <IdleWaveform />}

              {file && (
                <div className="w-full">
                  <p className="text-sm font-semibold text-text-main mb-2">
                    {file.name}
                  </p>
                  <FileWaveform />
                </div>
              )}
            </div>

            {/* Actions */}
            {!file ? (
              <>
                <input
                  id="audio-upload"
                  type="file"
                  accept="audio/*"
                  onChange={handleSelect}
                  className="hidden"
                />
                <label
                  htmlFor="audio-upload"
                  className="inline-block px-8 py-3 rounded-full
                  bg-primary text-white font-bold
                  hover:bg-primary-dark transition-all
                  cursor-pointer active:scale-95"
                >
                  Select Audio File
                </label>

                <p className="text-xs text-text-soft mt-4">
                  WAV / MP3 / M4A · 최대 30초
                </p>
              </>
            ) : (
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className={`w-full mt-6 px-10 py-4 rounded-full
                font-black tracking-wide transition-all
                ${
                  isAnalyzing
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-primary text-white hover:bg-primary-dark"
                }
                shadow-lg active:scale-95`}
              >
                {isAnalyzing ? "ANALYZING..." : "SCAN VOICE"}
              </button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function IdleWaveform() {
  return (
    <div className="flex items-end gap-1 h-10">
      {Array.from({ length: 24 }).map((_, i) => (
        <motion.span
          key={i}
          animate={{ height: ["20%", "100%", "20%"] }}
          transition={{
            repeat: Infinity,
            duration: 1.8,
            delay: i * 0.06,
            ease: "easeInOut",
          }}
          className="w-1 rounded-full bg-primary/40"
        />
      ))}
    </div>
  );
}

function FileWaveform() {
  const bars = useMemo(() => {
    const length = 48;
    const result = [];

    for (let i = 0; i < length; i++) {
      const base = Math.sin(i * 0.35) * 0.5 + 0.5;
      const mod = Math.cos(i * 0.18) * 0.25 + 0.75;
      const height = 30 + base * mod * 70;
      result.push(height);
    }

    return result;
  }, []);

  return (
    <motion.div
      layoutId="audio-waveform"
      className="flex items-end gap-0.5 h-12 justify-center"
    >
      {bars.map((h, i) => (
        <span
          key={i}
          style={{ height: `${h}%` }}
          className="w-1 rounded-full bg-primary/60"
        />
      ))}
    </motion.div>
  );
}
