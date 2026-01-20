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
            onClick={() => {
              clearFile();
              setStep("upload");
              nav("/image");
            }}
            className="px-4 py-2 rounded-pill bg-white/60 text-text-main text-xs hover:bg-white/70 transition"
          >
            분석으로 돌아가기
          </button>
        </div>
      </header>

      {loading ? (
        <p className="text-text-soft text-sm">불러오는 중…</p>
      ) : items.length === 0 ? (
        <ImageHistoryEmpty />
      ) : (
        <ImageHistoryList items={items} onOpen={openHistory} />
      )}

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
