import { useEffect } from "react";
import { useImageStore } from "../../../../store/image/imageStore";
import { getImageReport, generateImageReport } from "../../../../api/imageApi";

/* ---------------- Badge ---------------- */

function RiskBadge({ level }) {
  const tone =
    level === "HIGH"
      ? "bg-red-500/15 text-red-400 border-red-500/20"
      : level === "LOW"
        ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
        : "bg-amber-400/15 text-amber-400 border-amber-400/20";

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-widest border ${tone}`}
    >
      {level}
    </span>
  );
}

/* ---------------- Main ---------------- */

export default function ImageFinalReport() {
  const {
    setStep,
    result,
    report,
    setReport,
    isReportLoading,
    setReportLoading,
    reportError,
    setReportError,
    addToHistoryFromResult,
  } = useImageStore();

  const jobUuid = result?.job?.jobUuid;

  /* ---------------- Load Report ---------------- */

  useEffect(() => {
    if (!jobUuid) return;
    let alive = true;

    addToHistoryFromResult();

    const loadReport = async () => {
      try {
        setReportLoading(true);
        setReportError(null);

        try {
          const created = await generateImageReport(jobUuid);
          if (!alive) return;
          setReport(created);
          return;
        } catch {
          const fetched = await getImageReport(jobUuid);
          if (!alive) return;
          setReport(fetched);
        }
      } catch {
        if (alive) setReportError("리포트를 불러오는 중 오류가 발생했습니다.");
      } finally {
        if (alive) setReportLoading(false);
      }
    };

    loadReport();
    return () => (alive = false);
  }, [jobUuid]);

  /* ---------------- Derived ---------------- */

  const analysis = result?.results?.[0];
  const fallbackRisk = analysis?.riskLevel ?? "—";
  const fallbackScore = analysis?.riskScore ?? 0;

  const overallRiskLevel = report?.overallRiskLevel ?? fallbackRisk;

  const summaryText = isReportLoading
    ? "리포트를 생성 중입니다…"
    : reportError
      ? "리포트 생성에 실패했습니다."
      : (report?.summary ?? "리포트 데이터가 없습니다.");

  const guidance = Array.isArray(report?.guidance) ? report.guidance : [];

  const confidenceTone =
    overallRiskLevel === "HIGH"
      ? "hover:text-red-400 hover:bg-red-400/15"
      : overallRiskLevel === "LOW"
        ? "hover:text-emerald-400 hover:bg-emerald-400/15"
        : "hover:text-amber-400 hover:bg-amber-400/15";

  const scoreTone =
    overallRiskLevel === "HIGH"
      ? "text-red-400 drop-shadow-[0_0_12px_rgba(248,113,113,0.25)]"
      : overallRiskLevel === "LOW"
        ? "text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.25)]"
        : "text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.25)]";

  /* ---------------- Render ---------------- */

  return (
    <div className="space-y-14 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* ================= HEADER ================= */}
      <header className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-[11px] font-black tracking-[0.35em] text-text-soft uppercase">
            FINAL REPORT
          </p>
          <h2 className="text-[32px] leading-tight font-black text-text-main tracking-tight">
            최종 신뢰 리포트
          </h2>
          <p className="text-sm text-text-soft max-w-md">
            AI 분석 결과를 기반으로 자동 생성된 종합 리포트입니다.
          </p>
        </div>

        <button
          onClick={() => setStep("summary")}
          className={`
            inline-flex items-center gap-2
            px-4 py-2
            rounded-full
            text-[11px] font-bold tracking-widest
            text-text-soft
            border border-white/40
            bg-white/20
            transition-all
            active:scale-95
            ${confidenceTone}
          `}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          분석 결과 다시보기
        </button>
      </header>

      {/* ================= SCORE (INDEPENDENT) ================= */}
      <section className="flex items-end justify-between px-10">
        <div>
          <p className="text-xs font-black tracking-widest text-text-soft mb-2">
            OVERALL RISK
          </p>
          <RiskBadge level={overallRiskLevel} />
        </div>

        <div className="text-right">
          <p className="text-[11px] font-bold tracking-widest text-text-soft">
            SCORE
          </p>
          <p
            className={`
              text-[56px] leading-none font-black
              ${scoreTone}
            `}
          >
            {fallbackScore}
          </p>
        </div>
      </section>

      {/* ================= SUMMARY ================= */}
      <section className="rounded-[32px] bg-white/45 backdrop-blur-xl border border-white/30 p-8">
        {isReportLoading ? (
          <div className="space-y-3">
            <div className="h-4 w-2/3 bg-white/30 rounded animate-pulse" />
            <div className="h-4 w-1/2 bg-white/25 rounded animate-pulse" />
          </div>
        ) : (
          <p className="text-[15px] leading-relaxed text-text-main">
            {summaryText}
          </p>
        )}

        {reportError && (
          <p className="mt-3 text-xs text-red-400">{reportError}</p>
        )}
      </section>

      {/* ================= GUIDANCE ================= */}
      <section className="rounded-[32px] bg-white/45 backdrop-blur-xl border border-white/30 p-8">
        <p className="text-xs font-black tracking-widest text-text-soft mb-6">
          GUIDANCE
        </p>

        {isReportLoading ? (
          <div className="space-y-3">
            <div className="h-4 w-2/3 bg-white/25 rounded animate-pulse" />
            <div className="h-4 w-1/2 bg-white/25 rounded animate-pulse" />
          </div>
        ) : guidance.length > 0 ? (
          <ul className="space-y-4">
            {guidance.map((g, i) => (
              <li
                key={i}
                className="relative pl-5 text-[15px] leading-relaxed text-text-main"
              >
                <span className="absolute left-0 top-2 w-1.5 h-1.5 rounded-full bg-primary/70" />
                {g}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-text-soft">가이드 데이터가 없습니다.</p>
        )}
      </section>

      {/* ================= FOOTNOTE ================= */}
      <p className="text-[11px] text-text-soft text-center">
        ※ 본 리포트는 자동 생성된 요약으로 참고용이며 법적 효력을 가지지
        않습니다.
      </p>
    </div>
  );
}
