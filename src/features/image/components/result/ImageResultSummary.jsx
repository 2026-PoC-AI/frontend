import { useImageStore } from "../../../../store/image/imageStore";
import ImageRiskRing from "../viz/ImageRiskRing";

function Badge({ text, tone = "neutral" }) {
  const cls =
    tone === "danger"
      ? "bg-red-500/15 text-red-400 border-red-500/20"
      : tone === "safe"
        ? "bg-green-500/15 text-green-400 border-green-500/20"
        : "bg-white/30 text-text-main/80 border-white/35";

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs border ${cls}`}
    >
      {text}
    </span>
  );
}

export default function ImageResultSummary({ resultOverride }) {
  const { result: storeResult, setStep, clearFile } = useImageStore();
  const result = resultOverride ?? storeResult;

  const job = result?.job;
  const input = result?.input;
  const analysis = result?.results?.[0];

  if (!analysis) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center">
        <p className="text-text-main/70 mb-2">아직 결과 데이터가 없습니다.</p>
        <p className="text-xs text-text-soft">
          분석 결과를 불러오는 중이거나 아직 완료되지 않았습니다.
        </p>
      </div>
    );
  }

  const isFake = analysis.label === "FAKE";

  const isReportEnabled =
    job?.status === "ANALYZED" || job?.status === "REPORT_READY";

  return (
    <div className="space-y-8">
      <div className="grid lg:grid-cols-[220px_1fr] gap-6 items-center">
        <div className="relative">
          <ImageRiskRing score={analysis.riskScore} />
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge text={`Status: ${job?.status ?? "—"}`} />
            <Badge
              text={`Risk: ${analysis.riskLevel}`}
              tone={
                analysis.riskLevel === "HIGH"
                  ? "danger"
                  : analysis.riskLevel === "LOW"
                    ? "safe"
                    : "neutral"
              }
            />
            <Badge text={`Task: ${analysis.taskType}`} />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div
              className={`
                rounded-2xl p-5
                bg-white/45 backdrop-blur-xl border border-white/35
                ${isFake ? "shadow-[0_0_44px_rgba(239,68,68,0.18)]" : "shadow-[0_0_44px_rgba(34,197,94,0.14)]"}
              `}
            >
              <p className="text-xs tracking-widest text-text-soft mb-2">
                VERDICT
              </p>
              <p
                className={`text-3xl font-extrabold ${isFake ? "text-red-400" : "text-green-400"}`}
              >
                {analysis.label}
              </p>
            </div>

            <div className="rounded-2xl p-5 bg-white/45 backdrop-blur-xl border border-white/35">
              <p className="text-xs tracking-widest text-text-soft mb-2">
                CONFIDENCE
              </p>
              <p className="text-3xl font-extrabold text-text-main">
                {(analysis.confidence * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white/45 backdrop-blur-xl border border-white/35 p-6">
        <p className="text-xs tracking-widest text-text-soft mb-3">
          AI COMMENTARY
        </p>
        <p className="text-sm text-text-sub leading-relaxed">
          {analysis.interpretation}
        </p>
      </div>

      <div className="text-xs text-text-soft space-y-1">
        <p>파일명: {input?.filename ?? "—"}</p>
        <p>타입: {input?.mimeType ?? "—"}</p>
        <p>크기: {input?.fileSize ?? 0} bytes</p>
      </div>

      <button
        disabled={!isReportEnabled}
        onClick={() => {
          if (!isReportEnabled) return;
          setStep("report");
        }}
        className={`
          w-full py-4 rounded-pill transition
          ${
            isReportEnabled
              ? "bg-primary-dark/80 text-white hover:bg-primary-dark/90 shadow-[0_12px_40px_rgba(53,124,234,0.22)]"
              : "bg-white/30 text-text-soft cursor-not-allowed"
          }
        `}
      >
        {isReportEnabled ? "최종 리포트 보기" : "분석 결과 수신 대기 중"}
      </button>

      <button
        onClick={() => {
          clearFile();
          setStep("upload");
        }}
        className="text-xs text-text-soft hover:underline"
      >
        새로운 이미지 분석
      </button>
    </div>
  );
}
