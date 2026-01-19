export default function ImageReportActions({ onDownloadPdf, onShare }) {
  return (
    <div className="flex gap-4 pt-6">
      <button
        onClick={onDownloadPdf}
        className="flex-1 py-3 rounded-pill bg-primary-dark text-white shadow hover:bg-primary-dark/90 transition"
      >
        PDF 다운로드
      </button>
      <button
        onClick={onShare}
        className="flex-1 py-3 rounded-pill bg-white/60 text-text-main hover:bg-white/70 transition"
      >
        공유 링크
      </button>
    </div>
  );
}
