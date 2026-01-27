/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";

export default function ConfidenceGauge({ confidence }) {
  const percent = Math.round(confidence * 100);

  // Tone (파스텔톤)
  const tone =
    percent >= 75
      ? {
          main: "#EF6A5A", // red pastel
          sub: "#F5B1A8",
          label: "위험",
        }
      : percent >= 55
        ? {
            main: "#8A9B4F", // green pastel
            sub: "#C9D3A3",
            label: "주의",
          }
        : {
            main: "#6B7FD7", // blue pastel
            sub: "#B8C2F0",
            label: "안정",
          };

  const radius = 42;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="w-52 h-52 flex items-center justify-center">
      <div className="relative w-full h-full">
        {/* Sub Ring */}
        <svg viewBox="0 0 100 100" className="absolute inset-0">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={tone.sub}
            strokeWidth="10"
            strokeLinecap="round"
          />
        </svg>

        {/* Main Ring */}
        <motion.svg
          viewBox="0 0 100 100"
          className="absolute inset-0 -rotate-90"
        >
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={tone.main}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{
              strokeDashoffset: circumference * (1 - confidence),
            }}
            transition={{
              duration: 1.5,
              ease: "easeOut",
            }}
          />
        </motion.svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="text-3xl font-black" style={{ color: tone.main }}>
            {percent}%
          </p>

          <p className="mt-1 text-sm font-semibold text-gray-600">
            {tone.label}
          </p>
        </div>
      </div>
    </div>
  );
}
