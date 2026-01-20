import { useEffect } from "react";
import { useImageStore } from "../../../../store/image/imageStore";
import { getImageReport, generateImageReport } from "../../../../api/imageApi";
import ImageReportActions from "../report/ImageReportActions";

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

  useEffect(() => {
    if (!jobUuid) return;

    addToHistoryFromResult();

    let alive = true;

    const run = async () => {
      try {
        setReportError(null);
        setReportLoading(true);

        try {
          const data = await getImageReport(jobUuid);
          if (!alive) return;
          setReport(data);
          return;
        } catch (e) {
          console.log(e);
          const data = await generateImageReport(jobUuid);
          if (!alive) return;
          setReport(data);
        }
      } catch (e) {
        console.log(e);
        if (!alive) return;
        setReportError("리포트를 생성하는 중 오류가 발생했습니다.");
      } finally {
        setReportLoading(false);
      }
    };

    run();
    return () => {
      alive = false;
    };
  }, [jobUuid]);

  const analysis = result?.results?.[0];
  const fallbackRisk = analysis?.riskLevel ?? "—";
  const fallbackScore = analysis?.riskScore ?? 0;

  const overallRiskLevel = report?.overallRiskLevel ?? fallbackRisk;
  const summary = report?.summary ?? "리포트 요약을 생성 중입니다…";
  const guidance = Array.isArray(report?.guidance) ? report.guidance : [];

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

  return (
    <div className="space-y-7">
      <header className="flex justify-between items-start">
        <div>
          <p className="text-xs tracking-widest text-text-soft mb-2">
            FINAL REPORT
          </p>
          <h2 className="text-2xl font-extrabold text-text-main leading-tight">
            최종 신뢰 리포트
          </h2>
          <p className="text-sm text-text-soft mt-2">
            분석 결과를 기반으로 LLM이 작성한 최종 요약/가이드입니다.
          </p>
        </div>

        <button
          onClick={() => setStep("summary")}
          className="text-sm text-primary hover:underline"
        >
          요약으로 돌아가기
        </button>
      </header>

      <div className="rounded-2xl bg-white/45 backdrop-blur-xl border border-white/35 p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs tracking-widest text-text-soft">OVERALL RISK</p>
          <p className="text-xs text-text-soft mt-2">
            AI가 분석한 전체 이미지 신뢰도 평가입니다.
          </p>
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
                {summary}
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

      <div className="text-xs text-text-soft">
        ※ 본 리포트는 자동 생성된 요약으로 참고용입니다.
      </div>

      <ImageReportActions onDownloadPdf={onDownloadPdf} onShare={onShare} />
    </div>
  );
}
