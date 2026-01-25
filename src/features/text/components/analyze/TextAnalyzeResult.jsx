import React from "react";
import HighlightedText from "./HighlightedText";

function labelBadge(label) {
  const base = "px-3 py-1 rounded-full text-xs font-bold tracking-wide";
  if (label === "FAKE") return `${base} bg-red-500/15 text-red-600`;
  if (label === "TRUE") return `${base} bg-emerald-500/15 text-emerald-700`;
  if (label === "REAL") return `${base} bg-emerald-500/15 text-emerald-700`;
  return `${base} bg-gray-500/15 text-gray-700`;
}

export default function TextAnalyzeResult({ requestText, result, onRetry }) {
  if (!result) return null;

  const {
    label,
    score,
    evidences = [],
    highlights = [],
    references = [],
  } = result;

  const scorePct = Number.isFinite(score) ? Math.round(score * 100) : null;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* 요약 */}
      <section className="p-8 rounded-4xl bg-white/55 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className={labelBadge(label)}>{label}</span>
              {scorePct !== null && (
                <span className="text-xs text-text-main/50 tracking-[0.18em] font-bold">
                  CONFIDENCE {scorePct}%
                </span>
              )}
            </div>

            <h2 className="text-2xl font-extrabold text-text-main font-noto">
              분석 결과
            </h2>
            <p className="text-text-sub mt-2 font-noto">
              AI가 입력 텍스트를 기반으로 분류하고, 근거 후보 문장과 하이라이트 구간을 표시합니다.
            </p>
          </div>

          <button
            onClick={onRetry}
            className="px-6 py-2 rounded-full bg-primary text-white font-bold hover:brightness-110 transition-all shadow-lg shadow-primary/20"
          >
            다시 하기
          </button>
        </div>
      </section>

      {/* 원문 + 하이라이트 */}
      <section className="p-8 rounded-4xl bg-white/55 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
        <h3 className="text-lg font-bold text-text-main mb-4 font-noto">
          근거 하이라이트
        </h3>
        <div className="rounded-2xl bg-white/60 border border-white/70 p-5">
          <HighlightedText text={requestText} highlights={highlights} />
        </div>
        <p className="text-xs text-text-main/50 mt-4 font-noto leading-relaxed">
          * 하이라이트는 모델이 “의심 신호”로 판단한 구간을 표시한 것으로, 사실 여부의 확정 판정이 아닐 수 있습니다.
        </p>
      </section>

      {/* 근거 문장 */}
      <section className="p-8 rounded-4xl bg-white/55 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
        <h3 className="text-lg font-bold text-text-main mb-4 font-noto">
          근거 문장 (Top-K)
        </h3>

        {evidences.length === 0 ? (
          <p className="text-sm text-text-main/60 font-noto">
            근거 문장이 생성되지 않았습니다.
          </p>
        ) : (
          <ul className="space-y-3">
            {evidences.map((e, idx) => (
              <li
                key={`${idx}-${e.text?.slice(0, 20)}`}
                className="p-4 rounded-2xl bg-white/60 border border-white/70"
              >
                <div className="flex items-center justify-between gap-4 mb-2">
                  <span className="text-xs font-bold text-primary/70 tracking-[0.18em]">
                    EVIDENCE {idx + 1}
                  </span>
                  {typeof e.score === "number" && (
                    <span className="text-xs font-bold text-text-main/50">
                      score {(e.score * 100).toFixed(1)}%
                    </span>
                  )}
                </div>
                <p className="text-sm text-text-main/80 leading-relaxed font-noto whitespace-pre-wrap">
                  {e.text}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* 참고 링크(판정 근거 아님) */}
      <section className="p-8 rounded-4xl bg-white/55 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
        <h3 className="text-lg font-bold text-text-main mb-2 font-noto">
          추가로 확인해볼 자료 (판정 근거 아님)
        </h3>
        <p className="text-xs text-text-main/50 mb-5 font-noto leading-relaxed">
          AI 판정은 입력 텍스트 분석 결과에 기반합니다. 아래 링크는 관련 주제를 이해하기 위한 참고 자료입니다.
        </p>

        {references.length === 0 ? (
          <p className="text-sm text-text-main/60 font-noto">
            참고 자료가 없습니다. (include_references=false 이거나, 검색 실패일 수 있어요)
          </p>
        ) : (
          <ul className="space-y-3">
            {references.map((r, idx) => (
              <li
                key={`${idx}-${r.url}`}
                className="p-4 rounded-2xl bg-white/60 border border-white/70"
              >
                <a
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-bold text-primary hover:underline font-noto"
                >
                  {r.title}
                </a>
                {r.snippet && (
                  <p className="text-sm text-text-main/70 mt-2 font-noto leading-relaxed">
                    {r.snippet}
                  </p>
                )}
                <p className="text-xs text-text-main/40 mt-2 break-all">
                  {r.url}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
