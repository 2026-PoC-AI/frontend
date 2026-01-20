import ImageRiskRing from "../viz/ImageRiskRing";

export default function ImageHistoryPreview({ result }) {
  const analysis = result?.results?.[0];
  const input = result?.input;
  const job = result?.job;

  if (!analysis) return null;

  return (
    <div className="space-y-6">
      {/* 상단 요약 */}
      <div className="flex items-center gap-6">
        <div className="w-28">
          <ImageRiskRing score={analysis.riskScore} />
        </div>

        <div className="space-y-2">
          <p className="text-xs text-text-soft">VERDICT</p>
          <p
            className={`text-3xl font-extrabold ${
              analysis.label === "FAKE" ? "text-red-400" : "text-green-400"
            }`}
          >
            {analysis.label}
          </p>

          <p className="text-xs text-text-soft">
            Confidence {(analysis.confidence * 100).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* 짧은 설명 */}
      <div className="rounded-xl bg-white/40 border border-white/35 p-4">
        <p className="text-xs text-text-soft mb-1">AI COMMENT</p>
        <p className="text-sm text-text-main line-clamp-3">
          {analysis.interpretation}
        </p>
      </div>

      {/* 메타 정보 */}
      <div className="text-xs text-text-soft space-y-1">
        <p>파일명: {input?.filename}</p>
        <p>상태: {job?.status}</p>
      </div>
    </div>
  );
}
