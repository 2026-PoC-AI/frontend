import React, { useState } from "react";

export default function TextAnalyzeForm({ onSubmit, loading }) {
  const [text, setText] = useState("");
  const [evidenceK, setEvidenceK] = useState(3);
  const [includeReferences, setIncludeReferences] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    onSubmit({
      text,
      evidence_k: Number(evidenceK),
      include_references: Boolean(includeReferences),
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-8 rounded-[24px] bg-white/70 backdrop-blur-md shadow-glass-soft animate-fade-up m-2">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 본문 입력 */}
        <div className="border-2 border-dashed border-primary/40 rounded-xl p-6 transition-colors hover:border-primary/60 hover:bg-primary/5 group">
          <label className="block mb-2 text-sm font-bold text-text-main font-noto text-left">
            뉴스 본문 입력
          </label>
          <textarea
            className="w-full h-56 bg-transparent outline-none resize-none text-text-main placeholder:text-text-main/30 font-noto"
            placeholder="분석할 기사 내용을 이곳에 입력하거나 붙여넣으세요..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <p className="text-xs text-text-main/50 mt-3 font-noto">
            * 너무 긴 글은 모델 max_length에 의해 일부가 잘릴 수 있어요.
          </p>
        </div>

        {/* 옵션들 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* evidence_k */}
          <div className="p-4 rounded-xl bg-white/60 border border-white/70">
            <label className="text-sm font-bold text-text-main font-noto block mb-2">
              근거 문장 개수 (evidence_k)
            </label>
            <select
              className="w-full p-3 rounded-xl bg-white/70 border border-primary/10 focus:border-primary/40 outline-none text-sm text-text-main"
              value={evidenceK}
              onChange={(e) => setEvidenceK(e.target.value)}
            >
              {[1,2,3,4,5].map((n) => (
                <option key={n} value={n}>{n}개</option>
              ))}
            </select>
            <p className="text-xs text-text-main/50 mt-2 font-noto">
              * UX 기준 3개 추천 (너가 정한 기본값)
            </p>
          </div>

          {/* include_references */}
          <div
            className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
              includeReferences
                ? "bg-primary/15 border-primary/40"
                : "bg-white/60 border-white/70"
            }`}
            onClick={() => setIncludeReferences(!includeReferences)}
          >
            <div
              className={`mt-1 w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 ${
                includeReferences
                  ? "bg-primary border-primary"
                  : "bg-white border-primary/40"
              }`}
            >
              {includeReferences && (
                <span className="text-white text-[10px]">✓</span>
              )}
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-bold text-text-main font-noto">
                참고 링크 포함 (include_references)
              </p>
              <p className="text-xs text-text-main/70 mt-0.5 font-noto">
                판정 근거가 아니라 “추가로 확인해볼 자료” 섹션으로 표시됩니다.
              </p>
            </div>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex justify-center pt-2 pb-2">
          <button
            type="submit"
            disabled={loading || !text.trim()}
            className="px-10 py-3 rounded-full bg-primary text-white font-bold hover:brightness-110 transition-all shadow-lg disabled:bg-primary/30"
          >
            {loading ? "분석 중..." : "뉴스 분석 시작하기"}
          </button>
        </div>
      </form>
    </div>
  );
}
