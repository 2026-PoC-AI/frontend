import { useEffect } from "react";
import { useImageStore } from "../../../../store/image/imageStore";
import { getImageReport, generateImageReport } from "../../../../api/imageApi";
import ImageReportActions from "./ImageReportActions";

/* ---------------- Badge ---------------- */

function RiskBadge({ level }) {
  const tone =
    level === "HIGH"
      ? "bg-red-500/15 text-red-400 border-red-500/20"
      : level === "LOW"
        ? "bg-green-500/15 text-green-400 border-green-500/20"
        : "bg-yellow-400/15 text-yellow-300 border-yellow-400/20";

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs border ${tone}`}
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

        /* 1️⃣ 먼저 생성 시도 */
        try {
          const created = await generateImageReport(jobUuid);

          if (!alive) return;

          setReport(created);
          return;
        } catch (e) {
          console.warn("Report already exists. Try GET.", e);
        }

        /* 2️⃣ 생성 실패 시 조회 */
        const fetched = await getImageReport(jobUuid);

        if (!alive) return;

        setReport(fetched);
      } catch (e) {
        console.error(e);

        if (!alive) return;

        setReportError("리포트를 불러오는 중 오류가 발생했습니다.");
      } finally {
        if (alive) setReportLoading(false);
      }
    };

    loadReport();

    return () => {
      alive = false;
    };
  }, [jobUuid]);

  /* ---------------- Fallback ---------------- */

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

  /* ---------------- Actions ---------------- */

  const onDownloadPdf = () => {
    alert("PDF 다운로드는 다음 단계에서 연결할게요.");
  };

  const onShare = async () => {
    const shareUrl = `${window.location.origin}/image/history?job=${jobUuid}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "FakeHunters Image Report",
          text: "최종 이미지 신뢰 리포트",
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert("링크가 복사되었습니다.");
      }
    } catch {
      // ignore
    }
  };

  /* ---------------- Render ---------------- */

  return (
    <div className="space-y-7">
      {/* Header */}
      <header className="flex justify-between items-start">
        <div>
          <p className="text-xs tracking-widest text-text-soft mb-2">
            FINAL REPORT
          </p>

          <h2 className="text-2xl font-extrabold text-text-main leading-tight">
            최종 신뢰 리포트
          </h2>

          <p className="text-sm text-text-soft mt-2">
            분석 결과를 기반으로 생성된 AI 리포트입니다.
          </p>
        </div>

        <button
          onClick={() => setStep("summary")}
          className="text-sm text-primary hover:underline"
        >
          요약으로 돌아가기
        </button>
      </header>

      {/* Summary */}
      <div className="rounded-2xl bg-white/45 backdrop-blur-xl border border-white/35 p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs tracking-widest text-text-soft">OVERALL RISK</p>

          <RiskBadge level={overallRiskLevel} />
        </div>

        <div className="flex items-end justify-between gap-4">
          <div className="space-y-2">
            {isReportLoading ? (
              <div className="space-y-2">
                <div className="h-4 w-64 bg-white/30 rounded animate-pulse" />
                <div className="h-4 w-80 bg-white/25 rounded animate-pulse" />
              </div>
            ) : (
              <p className="text-sm text-text-main leading-relaxed">
                {summaryText}
              </p>
            )}

            {reportError && (
              <p className="text-xs text-red-300">{reportError}</p>
            )}
          </div>

          <div className="text-right">
            <p className="text-xs text-text-soft">RISK SCORE</p>

            <p className="text-3xl font-extrabold text-text-main">
              {fallbackScore}
            </p>
          </div>
        </div>
      </div>

      {/* Guidance */}
      <div className="rounded-2xl bg-white/45 backdrop-blur-xl border border-white/35 p-6">
        <p className="text-xs tracking-widest text-text-soft mb-3">GUIDANCE</p>

        {isReportLoading ? (
          <div className="space-y-2">
            <div className="h-4 w-2/3 bg-white/25 rounded animate-pulse" />
            <div className="h-4 w-1/2 bg-white/25 rounded animate-pulse" />
          </div>
        ) : guidance.length > 0 ? (
          <ul className="space-y-3">
            {guidance.map((g, idx) => (
              <li
                key={idx}
                className="rounded-xl bg-white/40 border border-white/35 p-4"
              >
                <p className="text-sm text-text-main leading-relaxed">{g}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-text-soft">가이드 데이터가 없습니다.</p>
        )}
      </div>

      {/* Footer */}
      <div className="text-xs text-text-soft">
        ※ 본 리포트는 자동 생성된 요약으로 참고용입니다.
      </div>

      <ImageReportActions onDownloadPdf={onDownloadPdf} onShare={onShare} />
    </div>
  );
}
