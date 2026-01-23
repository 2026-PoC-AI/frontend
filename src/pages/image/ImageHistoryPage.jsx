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
        if (!alive) return;
        setItems(res.items);
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
    <main className="relative px-6 pt-10 pb-10 max-w-5xl mx-auto">
      <header className="flex items-end justify-between mb-16 border-b border-black/5 pb-10">
        <div>
          <p className="text-[10px] font-black tracking-[0.4em] text-primary/60 mb-2 uppercase">
            Archive
          </p>
          <h1 className="text-5xl font-black text-text-main tracking-tight">
            History
          </h1>
          <p className="text-text-soft font-medium text-sm mt-4 opacity-70">
            과거에 수행한 분석 결과의 기록입니다.
          </p>
        </div>

        <button
          onClick={() => {
            clearFile();
            setStep("upload");
            nav("/image");
          }}
          className="flex items-center gap-3 px-6 py-3 rounded-full bg-black text-white text-[11px] font-black tracking-[0.1em] hover:bg-zinc-800 transition-all active:scale-95 shadow-lg shadow-black/10"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          새 분석 시작
        </button>
      </header>

      <section className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
        {loading ? (
          <div className="py-40 text-center">
            <div className="w-8 h-8 border-4 border-primary/10 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[11px] font-black tracking-widest text-primary/40 uppercase">
              Loading Archive
            </p>
          </div>
        ) : items.length === 0 ? (
          <ImageHistoryEmpty />
        ) : (
          <div className="grid gap-6">
            <ImageHistoryList items={items} onOpen={openHistory} />
          </div>
        )}
      </section>

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
