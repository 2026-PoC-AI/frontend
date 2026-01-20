import { useEffect, useState } from "react";
import { getImageAnalysisResult } from "../../../../api/imageApi";
import ImageHistoryPreview from "./ImageHistoryPreview";

export default function ImageHistoryModal({ jobUuid, onClose, onGoFull }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!jobUuid) return;

    let alive = true;
    (async () => {
      try {
        const res = await getImageAnalysisResult(jobUuid);
        if (alive) setData(res);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [jobUuid]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* modal */}
      <div className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-[28px] bg-white/70 backdrop-blur-2xl border border-white/50 p-10 shadow-glass-strong">
        <header className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-extrabold text-text-main">
            분석 결과 미리보기
          </h2>
          <button
            onClick={onClose}
            className="text-text-soft hover:text-text-main"
          >
            ✕
          </button>
        </header>

        {loading ? (
          <p className="text-text-soft">불러오는 중…</p>
        ) : (
          <>
            <ImageHistoryPreview result={data} />

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => onGoFull(data)}
                className="flex-1 py-3 rounded-pill bg-primary-dark text-white hover:bg-primary-dark/90"
              >
                전체 리포트 보기
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-pill bg-white/60 text-text-main hover:bg-white/70"
              >
                닫기
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
