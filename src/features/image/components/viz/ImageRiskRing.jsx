export default function ImageRiskRing({ score = 0 }) {
  const radius = 56;
  const stroke = 10;
  const normalizedRadius = radius - stroke;
  const circumference = normalizedRadius * 2 * Math.PI;
  const clamped = Math.max(0, Math.min(100, score));
  const offset = circumference - (clamped / 100) * circumference;

  const ringColor =
    clamped >= 70
      ? "rgb(239 68 68)"
      : clamped >= 40
        ? "rgb(250 204 21)"
        : "rgb(34 197 94)";

  const glow =
    clamped >= 70
      ? "shadow-[0_0_50px_rgba(239,68,68,0.25)]"
      : clamped >= 40
        ? "shadow-[0_0_50px_rgba(250,204,21,0.22)]"
        : "shadow-[0_0_50px_rgba(34,197,94,0.20)]";

  return (
    <div className={`relative mx-auto w-44 h-44 ${glow}`}>
      <div className="absolute inset-0 rounded-full bg-white/20 blur-xl" />
      <svg className="relative" height={radius * 2} width={radius * 2}>
        <defs>
          <linearGradient id="ringBase" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.08)" />
          </linearGradient>
        </defs>

        <circle
          stroke="url(#ringBase)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />

        <circle
          stroke={ringColor}
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          style={{
            transition:
              "stroke-dashoffset 900ms cubic-bezier(.2,.9,.2,1), stroke 600ms ease",
            filter: "drop-shadow(0 0 10px rgba(0,0,0,0.08))",
          }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-[11px] tracking-[0.32em] text-text-soft">RISK</p>
        <p className="text-4xl font-extrabold text-text-main leading-none">
          {clamped}
        </p>
        <p className="text-[11px] text-text-soft mt-1">/ 100</p>
      </div>
    </div>
  );
}
