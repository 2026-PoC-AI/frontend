export default function ImageRiskRing({ score = 0, variant = "default" }) {
  const isMini = variant === "mini";
  const radius = isMini ? 36 : 56;
  const stroke = isMini ? 6 : 10; // 선 두께 소폭 조정
  const size = radius * 2;
  const normalizedRadius = radius - stroke;
  const circumference = normalizedRadius * 2 * Math.PI;
  const clamped = Math.max(0, Math.min(100, score));
  const offset = circumference - (clamped / 100) * circumference;

  const level = clamped >= 70 ? "HIGH" : clamped >= 40 ? "MEDIUM" : "LOW";

  const colors = {
    HIGH: "stroke-red-500 shadow-red-500/30",
    MEDIUM: "stroke-amber-400 shadow-amber-400/30",
    LOW: "stroke-emerald-500 shadow-emerald-500/30",
  };

  return (
    <div
      className={`relative flex items-center justify-center ${isMini ? "w-20 h-20" : "w-44 h-44"}`}
    >
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background Track */}
        <circle
          stroke="currentColor"
          className="text-black/5"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* Progress Circle */}
        <circle
          className={`${colors[level]} transition-all duration-1000 ease-out`}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>

      <div className="absolute flex flex-col items-center justify-center">
        {!isMini && (
          <span className="text-[10px] font-bold tracking-widest text-text-soft opacity-60">
            RISK
          </span>
        )}
        <span
          className={`font-black text-text-main ${isMini ? "text-lg" : "text-4xl"}`}
        >
          {clamped}
        </span>
        {!isMini && (
          <span className="text-[10px] font-medium text-text-soft">/ 100</span>
        )}
      </div>
    </div>
  );
}
