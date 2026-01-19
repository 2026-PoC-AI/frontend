export default function ImageResultPlaceholder() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center px-6">
      <div className="mb-6 w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-br from-primary-soft to-primary-mint/40 text-primary opacity-90">
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </div>

      <p className="text-text-main/70 mb-1">분석 결과 대기 중</p>
      <p className="text-xs text-text-soft">
        왼쪽에서 이미지를 업로드하고 분석을 시작하세요
      </p>
    </div>
  );
}
