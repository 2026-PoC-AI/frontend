import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useImageStore } from "../../store/image/imageStore";
import { getImageHistory } from "../../api/imageApi";
import ImageHistoryList from "../../features/image/components/history/ImageHistoryList";
import ImageHistoryEmpty from "../../features/image/components/history/ImageHistoryEmpty";
import ImageHistoryModal from "../../features/image/components/history/ImageHistoryModal";

export default function ImageHistoryPage() {
  const nav = useNavigate();
  const { setStep, clearFile, setResult, setReport } = useImageStore();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobUuid, setSelectedJobUuid] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const jobUuids = useMemo(() => {
    try {
      return JSON.parse(
        localStorage.getItem("fakehunters:image:jobUuids") || "[]",
      );
    } catch {
      return [];
    }
  }, []);

  useEffect(() => {
    if (jobUuids.length === 0) {
      setLoading(false);
      return;
    }

    let alive = true;
    (async () => {
      try {
        const res = await getImageHistory(jobUuids);
        if (alive) setItems(res.items);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [jobUuids]);

  const openHistory = (jobUuid) => {
    setSelectedJobUuid(jobUuid);
    setModalOpen(true);
  };

  return (
    <main className="relative max-w-6xl mx-auto px-6 pt-14 pb-20">
      {/* ================= HEADER ================= */}
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-10 mb-20 px-10">
        <div>
          <p className="text-[10px] font-black tracking-[0.45em] text-primary/60 uppercase mb-3">
            Archive
          </p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-text-main">
            Analysis History
          </h1>
          <p className="mt-4 text-sm text-text-soft/70 max-w-md">
            과거에 수행한 이미지 분석 결과를 한눈에 확인할 수 있습니다.
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={() => {
            clearFile();
            setStep("upload");
            nav("/image");
          }}
          className="
            inline-flex items-center gap-3
            px-6 py-3
            rounded-full
            text-[11px] font-black tracking-[0.15em]
            text-primary
            bg-white/60 backdrop-blur-xl
            border border-primary/20
            hover:bg-primary/10
            hover:border-primary/40
            transition-all duration-300
            active:scale-95
            cursor-pointer
          "
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          새로운 분석하기
        </button>
      </header>

      {/* ================= CONTENT ================= */}
      <section className="animate-in fade-in slide-in-from-bottom-6 duration-700">
        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center gap-5">
            <div className="w-9 h-9 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
            <p className="text-[11px] font-black tracking-widest text-primary/40 uppercase">
              Loading Archive
            </p>
          </div>
        ) : items.length === 0 ? (
          <ImageHistoryEmpty />
        ) : (
          <div className="grid gap-5">
            <ImageHistoryList items={items} onOpen={openHistory} />
          </div>
        )}
      </section>

      {/* ================= MODAL ================= */}
      {modalOpen && (
        <ImageHistoryModal
          jobUuid={selectedJobUuid}
          onClose={() => setModalOpen(false)}
          onGoFull={(resultData) => {
            setModalOpen(false);
            setResult(resultData);
            setReport(null);
            setStep("summary");
            nav("/image");
          }}
        />
      )}
    </main>
  );
}
