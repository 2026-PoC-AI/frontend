/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";

export default function ConfidenceGauge({ confidence }) {
  const percent = Math.round(confidence * 100);

  const color =
    percent >= 80
      ? "text-green-500"
      : percent >= 60
        ? "text-yellow-500"
        : "text-red-500";

  return (
    <section className="flex flex-col items-center gap-6">
      <h2 className="text-xl font-black">Confidence Level</h2>

      <div className="relative w-56 h-56">
        {/* Background Ring */}
        <div className="absolute inset-0 rounded-full border-[14px] border-white/40" />

        {/* Animated Ring */}
        <motion.svg
          viewBox="0 0 100 100"
          className="absolute inset-0 -rotate-90"
        >
          <motion.circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="currentColor"
            strokeWidth="14"
            strokeLinecap="round"
            className={color}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: confidence }}
            transition={{ duration: 1.4, ease: "easeOut" }}
          />
        </motion.svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-5xl font-black ${color}`}>{percent}%</span>
          <span className="text-xs text-text-soft mt-1">
            Overall confidence
          </span>
        </div>
      </div>
    </section>
  );
}
