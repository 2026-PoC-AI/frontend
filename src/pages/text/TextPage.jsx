import React, { useState } from "react";
import { analyzeText } from "../../api/textApi";
import TextAnalyzeForm from "../../features/text/components/analyze/TextAnalyzeForm";
import TextAnalyzeResult from "../../features/text/components/analyze/TextAnalyzeResult";

const LoadingPanel = () => (
  <div className="text-center py-20 animate-fade-up">
    <div className="inline-block w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-6"></div>
    <h2 className="text-2xl font-bold text-text-main mb-2 font-noto">
      분석 중...
    </h2>
    <p className="text-text-sub font-noto">
      모델이 텍스트를 분류하고 근거/하이라이트를 생성하고 있습니다.
    </p>
  </div>
);

export default function TextPage() {
  const [status, setStatus] = useState("idle"); // idle | analyzing | success | error
  const [result, setResult] = useState(null);
  const [requestText, setRequestText] = useState("");
  const [errorInfo, setErrorInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (payload) => {
    setLoading(true);
    setStatus("analyzing");
    setErrorInfo(null);
    setResult(null);
    setRequestText(payload.text);

    try {
      const data = await analyzeText(payload);
      setResult(data);
      setStatus("success");
    } catch (err) {
      console.error(err);
      setErrorInfo(err?._readable || { msg: err?.message || "Unknown error" });
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStatus("idle");
    setResult(null);
    setRequestText("");
    setErrorInfo(null);
    setLoading(false);
  };

  return (
    <main className="relative px-6 pt-15 pb-32 max-w-6xl mx-auto overflow-hidden">
      {/* 헤더 */}
      <div className="text-center mb-10 animate-fade-up">
        <h1 className="text-4xl font-extrabold text-text-main mb-4 tracking-tight font-noto">
          Text Analysis
        </h1>
        <p className="text-text-sub text-lg font-noto">
          의심되는 뉴스 텍스트가 조작되었거나 왜곡된 프레이밍을 포함하는지
          분석합니다.
        </p>
      </div>

      {/* 상태별 렌더 */}
      <div className="transition-all duration-500 mt-3">
        {status === "idle" && (
          <div className="animate-fade-up">
            <TextAnalyzeForm onSubmit={handleSubmit} loading={loading} />
          </div>
        )}

        {status === "analyzing" && <LoadingPanel />}

        {status === "error" && (
          <div className="p-10 rounded-4xl bg-white/50 backdrop-blur-xl text-center animate-fade-up shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
            <h2 className="text-2xl font-bold text-red-500 mb-4 font-noto">
              분석 실패
            </h2>
            <p className="text-text-sub mb-6 font-noto leading-relaxed">
              요청은 갔지만 서버에서 오류가 발생했습니다.
              <br />
              {errorInfo?.status && (
                <span className="text-sm text-text-main/60">
                  (HTTP {errorInfo.status})
                </span>
              )}
            </p>
            {errorInfo?.msg && (
              <pre className="text-left text-xs bg-white/60 border border-white/70 p-4 rounded-2xl overflow-auto mb-6 whitespace-pre-wrap">
                {errorInfo.msg}
              </pre>
            )}
            <button
              onClick={reset}
              className="px-12 py-3.5 rounded-full bg-primary text-white font-bold hover:brightness-110 transition-all shadow-lg shadow-primary/20"
            >
              다시 시도하기
            </button>
          </div>
        )}

        {status === "success" && (
          <TextAnalyzeResult
            requestText={requestText}
            result={result}
            onRetry={reset}
          />
        )}
      </div>
    </main>
  );
}
