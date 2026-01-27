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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-lg"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="
          relative w-full max-w-xl max-h-[85vh]
          overflow-hidden
          rounded-[32px]
          bg-white/70 backdrop-blur-3xl
          border border-white/60
          shadow-[0_24px_48px_-12px_rgba(0,0,0,0.18)]
          animate-in fade-in zoom-in duration-500
        "
      >
        <div className="p-6 md:p-8 flex flex-col max-h-[85vh]">
          {/* Header */}
          <header className="flex justify-between items-start mb-6">
            <div>
              <p className="text-[10px] font-black tracking-[0.4em] text-primary/60 uppercase mb-1">
                Analysis Preview
              </p>
              <h2 className="text-xl font-black text-text-main tracking-tight">
                분석 결과 미리보기
              </h2>
            </div>
            <button
              onClick={onClose}
              className="
                p-2 rounded-full
                hover:bg-black/5
                active:scale-95
                transition
              "
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="text-text-soft"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </header>

          {/* Content */}
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <div className="w-10 h-10 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
              <p className="text-xs font-bold text-primary/40 tracking-widest">
                LOADING
              </p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto pr-1">
                <ImageHistoryPreview result={data} />
              </div>

              {/* Footer */}
              <footer className="flex gap-3 mt-6">
                {/* Primary CTA */}
                <button
                  onClick={() => onGoFull(data)}
                  className="
                    relative flex-1 py-3.5 px-4 rounded-[20px]
                    text-sm font-black tracking-wide text-white
                    bg-gradient-to-r from-primary-dark to-primary
                    shadow-[0_10px_30px_-10px_rgba(59,130,246,0.7)]
                    transition-all
                    hover:brightness-110
                    hover:shadow-[0_14px_36px_-12px_rgba(59,130,246,0.85)]
                    active:scale-95
                  "
                >
                  전체 리포트 확인
                </button>
              </footer>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
