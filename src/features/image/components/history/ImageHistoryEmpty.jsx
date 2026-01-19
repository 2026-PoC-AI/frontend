export default function ImageHistoryEmpty() {
  return (
    <div className="rounded-[28px] bg-white/45 backdrop-blur-xl border border-white/35 p-12 text-center">
      <p className="text-text-main/80 font-semibold mb-2">
        히스토리가 비어있어요
      </p>
      <p className="text-xs text-text-soft">
        이미지를 분석하면 결과가 여기에 저장됩니다.
      </p>
    </div>
  );
}
