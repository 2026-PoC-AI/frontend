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
      {/* Backdrop: 메인 페이지의 부드러운 느낌을 유지하도록 블러 강화 */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xl transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl overflow-hidden rounded-[40px] bg-white/70 backdrop-blur-3xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] border border-white/60 animate-in fade-in zoom-in duration-500">
        <div className="p-8 md:p-14">
          <header className="mb-12 flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black tracking-[0.4em] text-primary/60 mb-2 uppercase">
                Analysis Preview
              </p>
              <h2 className="text-3xl font-black text-text-main tracking-tight leading-tight">
                분석 결과 미리보기
              </h2>
            </div>
            <button
              onClick={onClose}
              className="group p-3 hover:bg-black/5 rounded-full transition-all duration-300"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="text-text-soft group-hover:rotate-90 transition-transform duration-300"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </header>

          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
              <p className="text-sm font-bold text-primary/40 tracking-widest animate-pulse">
                LOADING DATA
              </p>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <ImageHistoryPreview result={data} />

              <footer className="grid grid-cols-2 gap-4 mt-12">
                <button
                  onClick={() => onGoFull(data)}
                  className="group relative py-4.5 px-6 rounded-[22px] bg-primary-dark text-white font-bold overflow-hidden transition-all active:scale-95 shadow-lg shadow-primary-dark/20"
                >
                  <span className="relative z-10">전체 리포트 확인</span>
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                <button
                  onClick={onClose}
                  className="py-4.5 px-6 rounded-[22px] bg-black/5 text-text-main font-bold hover:bg-black/10 transition-all active:scale-95 border border-black/5"
                >
                  창 닫기
                </button>
              </footer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
