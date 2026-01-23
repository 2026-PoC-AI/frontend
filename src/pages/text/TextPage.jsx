import React, { useState } from 'react';
import { analyzeText } from "../../api/textApi";
import TextAnalyzeForm from '../../features/text/components/analyze/TextAnalyzeForm';

const LoadingPanel = () => (
  <div className="text-center py-20 animate-fade-up">
    <div className="inline-block w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-6"></div>
    <h2 className="text-2xl font-bold text-text-main mb-2 font-noto">교차 검증 중...</h2>
    <p className="text-text-sub font-noto">AI가 외신 데이터베이스를 탐색하고 있습니다.</p>
  </div>
);

export default function TextPage() {
  const [status, setStatus] = useState("idle"); 
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalysisStart = async (formData) => {
    setLoading(true);
    setStatus("analyzing");
    
    try {
      const response = await analyzeText(formData); 
      setResult(response.data);
      setStatus("success");
    } catch (error) {
      console.error("서버 응답 에러 (정상적인 연결 확인됨):", error);
      setStatus("error"); 
    } finally {
      setLoading(false);
    }
  };

  return (
    

    <main className="relative px-6 pt-15 pb-32 max-w-4xl mx-auto overflow-hidden">
        <div className="text-center mb-8 animate-fade-up">
          <h1 className="text-5xl font-extrabold text-text-main mb-4 tracking-tight font-noto">
            Text Analysis
          </h1>
          <p className="text-text-sub text-lg font-noto">
            의심되는 뉴스 텍스트가 조작되었거나 왜곡된 프레이밍을 포함하는지 분석합니다.
          </p>
        </div>

       
        <div className="transition-all duration-500 mt-3">
          {status === "idle" && (
            <div className="animate-fade-up">
              <TextAnalyzeForm onAnalysisStart={handleAnalysisStart} loading={loading} />
            </div>
          )}

          {status === "analyzing" && <LoadingPanel />}

          {/* 2. 서버 에러 화면 (실선 제거 및 ImagePage 스타일 적용) */}
          {status === "error" && (
            <div className="p-10 rounded-4xl bg-white/50 backdrop-blur-xl text-center animate-fade-up shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
              <h2 className="text-2xl font-bold text-red-500 mb-4 font-noto">서버 연결 확인됨 (500)</h2>
              <p className="text-text-sub mb-8 font-noto leading-relaxed">
                통신은 성공했으나 백엔드 내부에서 오류가 발생했습니다. <br/>
                TNS_ADMIN 설정 등 DB 연결 상태를 확인해주세요.
              </p>
              <button 
                onClick={() => setStatus("idle")} 
                className="px-12 py-3.5 rounded-full bg-primary text-white font-bold hover:brightness-110 transition-all shadow-lg shadow-primary/20"
              >
                다시 시도하기
              </button>
            </div>
          )}

          {/* 3. 분석 완료 화면 (실선 제거 및 ImagePage 스타일 적용) */}
          {status === "success" && (
            <div className="p-10 rounded-4xl bg-white/50 backdrop-blur-xl text-center animate-fade-up shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
              <h2 className="text-2xl font-bold text-text-main mb-4 font-noto">분석 완료</h2>
              {result && <p className="text-xs text-primary/40 mb-4 tracking-[0.2em] font-bold">ANALYSIS COMPLETE</p>}
              <p className="text-text-sub mb-8 font-noto">성공적으로 분석 데이터를 수신했습니다.</p>
              <button 
                onClick={() => setStatus("idle")} 
                className="px-12 py-3.5 rounded-full bg-primary text-white font-bold hover:brightness-110 transition-all shadow-lg shadow-primary/20"
              >
                다시 하기
              </button>
            </div>
          )}
        </div>
      </main>
    
  );
}