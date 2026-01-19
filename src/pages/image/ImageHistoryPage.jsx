import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useImageStore } from "../../store/image/imageStore";
import { getImageAnalysisResult } from "../../api/imageApi";
import ImageHistoryList from "../../features/image/components/history/ImageHistoryList";
import ImageHistoryEmpty from "../../features/image/components/history/ImageHistoryEmpty";

export default function ImageHistoryPage() {
  const nav = useNavigate();
  const {
    history,
    removeHistory,
    clearHistory,
    setResult,
    setStep,
    setReport,
  } = useImageStore();

  const [loadingUuid, setLoadingUuid] = useState(null);

  const openHistory = async (jobUuid) => {
    try {
      setLoadingUuid(jobUuid);
      const data = await getImageAnalysisResult(jobUuid);

      // 히스토리에서 열면: result 세팅 + report는 새로 로드(Report 화면에서 처리)
      setResult(data);
      setReport(null);
      setStep("summary");

      // 이미지 분석 페이지로 이동
      nav("/image");
    } finally {
      setLoadingUuid(null);
    }
  };

  return (
    <main className="relative px-6 pt-20 pb-32 max-w-4xl mx-auto">
      <header className="flex items-end justify-between mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-text-main mb-2">
            Image History
          </h1>
          <p className="text-text-sub text-sm">
            이전 분석 결과를 다시 확인할 수 있어요.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => nav("/image")}
            className="px-4 py-2 rounded-pill bg-white/60 text-text-main text-xs hover:bg-white/70 transition"
          >
            분석으로 돌아가기
          </button>
          <button
            onClick={clearHistory}
            className="px-4 py-2 rounded-pill bg-white/30 text-text-soft text-xs hover:bg-white/40 transition"
          >
            전체 삭제
          </button>
        </div>
      </header>

      {history.length === 0 ? (
        <ImageHistoryEmpty />
      ) : (
        <>
          {loadingUuid && (
            <div className="mb-4 text-xs text-text-soft">
              불러오는 중: {loadingUuid}
            </div>
          )}
          <ImageHistoryList
            items={history}
            onOpen={openHistory}
            onRemove={removeHistory}
          />
        </>
      )}
    </main>
  );
}
