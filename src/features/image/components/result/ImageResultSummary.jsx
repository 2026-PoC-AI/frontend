// src/features/image/components/result/ImageResultSummary.jsx
import { useImageStore } from "../../../../store/image/imageStore";
import ImageRiskRing from "../viz/ImageRiskRing";
import ImageArtifactGallery from "../viz/ImageArtifactGallery";
import RiskDistributionBar from "../viz/RiskDistributionBar";
import ConfidenceMeter from "../viz/ConfidenceMeter";
import AIInsightCard from "../viz/AIInsightCard";

export default function ImageResultSummary({ resultOverride }) {
  const { result: storeResult, setStep, clearFile } = useImageStore();
  const result = resultOverride ?? storeResult;

  const job = result?.job;
  const analysis = result?.results?.[0];

  if (!analysis) {
    return (
      <div className="h-full flex items-center justify-center text-text-soft">
        분석 결과를 불러오는 중입니다…
      </div>
    );
  }

  const isFake = analysis.label === "FAKE";
  const theme = isFake ? "red" : "emerald";

  const isReportEnabled =
    job?.status === "ANALYZED" || job?.status === "REPORT_READY";

  const riskLevel = analysis.riskLevel;

  const reportHoverTone =
    riskLevel === "HIGH"
      ? "hover:text-red-400 hover:bg-red-400/15"
      : riskLevel === "LOW"
        ? "hover:text-emerald-400 hover:bg-emerald-400/15"
        : "hover:text-amber-400 hover:bg-amber-400/15";

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      {/* ================= ACTIONS ================= */}
      <section>
        <div
          className="
            mx-auto max-w-full
            flex items-center justify-between
          "
        >
          {/* Secondary Action */}
          <button
            onClick={() => {
              clearFile();
              setStep("upload");
            }}
            className="
            inline-flex items-center gap-2
            px-3 py-2
            rounded-full
            text-[11px] font-semibold
            text-text-soft
            hover:text-primary
            hover:bg-primary/10
            transition-colors
            active:scale-95
          "
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M12 19V5M5 12h14" />
            </svg>
            새 이미지 분석
          </button>

          {/* Primary Action */}
          <button
            disabled={!isReportEnabled}
            onClick={() => isReportEnabled && setStep("report")}
            className={`
            inline-flex items-center gap-2
            px-4 py-2
            rounded-full
            text-[11px] font-bold tracking-widest
            transition-all
            active:scale-95
            ${
              isReportEnabled
                ? `
                  text-text-main
                  bg-white/30
                  border border-white/40
                  ${reportHoverTone}
                `
                : "text-text-soft/50 cursor-not-allowed"
            }
          `}
          >
            최종 리포트
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>
      {/* ================= HERO VERDICT ================= */}
      <section
        className={`
          relative overflow-hidden rounded-[40px] p-12
          border border-${theme}-500/20
          bg-gradient-to-br from-${theme}-500/[0.12] via-transparent to-transparent
          shadow-[0_0_80px_rgba(0,0,0,0.12)]
        `}
      >
        {/* glow */}
        <div
          className={`absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-25 bg-${theme}-500`}
        />

        <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
          {/* LEFT */}
          <div>
            <p
              className={`text-[11px] font-black tracking-[0.35em] uppercase text-${theme}-500/60`}
            >
              FINAL VERDICT
            </p>

            <h1
              className={`mt-4 text-6xl font-black tracking-tight ${
                isFake ? "text-red-500" : "text-emerald-500"
              }`}
            >
              {analysis.label}
            </h1>

            <p className="mt-6 text-xs text-text-sub max-w-md">
              AI가 이미지의 패턴, 얼굴 경계, 주목 영역을 종합 분석한 최종 판단
              결과입니다.
            </p>
          </div>

          {/* RIGHT */}
          <div className="flex justify-center">
            <ImageRiskRing score={analysis.riskScore} />
          </div>
        </div>
      </section>

      {/* ================= VISUAL METRICS ================= */}
      <section className="grid md:grid-cols-2 gap-8">
        <RiskDistributionBar score={analysis.riskScore} />
        <ConfidenceMeter confidence={analysis.confidence} />
      </section>

      {/* ================= AI INSIGHT ================= */}
      <AIInsightCard text={analysis.interpretation} />

      {/* ================= ARTIFACTS ================= */}
      <ImageArtifactGallery />
    </div>
  );
}
