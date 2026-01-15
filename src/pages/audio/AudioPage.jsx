// src/pages/audio/AudioPage.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { analyzeAudio } from "../../api/audioApi";

// ================= UI Components =================

const AudioUploadForm = ({ onFileSelect, isAnalyzing }) => {
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-8 rounded-[24px] bg-white/50 backdrop-blur-md border border-white/60 shadow-glass-soft text-center">
      <div className="border-2 border-dashed border-primary/30 rounded-xl p-10 transition-colors hover:border-primary/60 hover:bg-primary/5">
        <input
          type="file"
          accept=".wav,.mp3,.m4a"
          onChange={handleFileChange}
          disabled={isAnalyzing}
          className="hidden"
          id="audio-upload"
        />
        <label
          htmlFor="audio-upload"
          className="cursor-pointer flex flex-col items-center gap-4"
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl">
            🎙️
          </div>
          <div>
            <p className="text-lg font-bold text-text-main">음성 파일 업로드</p>
            <p className="text-sm text-text-sub mt-2">
              WAV, MP3, M4A (최소 5초 이상)
            </p>
          </div>
          <span className="px-6 py-2 rounded-full bg-primary text-white font-medium hover:bg-primary-dark transition-colors">
            파일 선택하기
          </span>
        </label>
      </div>
    </div>
  );
};

const LoadingPanel = () => (
  <div className="text-center py-20 animate-fade-up">
    <div className="inline-block w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-6"></div>
    <h2 className="text-2xl font-bold text-text-main mb-2">딥보이스 분석 중...</h2>
    <p className="text-text-sub">AI가 스펙트로그램과 음성 패턴을 분석하고 있습니다.</p>
  </div>
);

const ResultPanel = ({ result }) => {
  const { output } = result;
  
  // 위험도에 따른 색상 결정
  const getRiskColor = (score) => {
    if (score >= 80) return "text-red-500";
    if (score >= 50) return "text-orange-500";
    return "text-green-500";
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-up space-y-8">
      {/* 1. 상단: 위험도 점수 및 등급 */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 p-8 rounded-[24px] bg-white/60 backdrop-blur-md border border-white/60 shadow-glass-soft flex flex-col items-center justify-center text-center">
          <h3 className="text-lg font-medium text-text-sub mb-2">딥보이스 위험도</h3>
          <div className={`text-6xl font-bold ${getRiskColor(output.riskScore)}`}>
            {output.riskScore}<span className="text-2xl text-text-sub/50">/100</span>
          </div>
          <div className="mt-4 px-4 py-1 rounded-full bg-paper border border-primary/10 text-text-main font-bold">
            Grade: {output.grade}
          </div>
        </div>

        {/* 2. 스펙트로그램 뷰어 */}
        <div className="flex-[1.5] p-8 rounded-[24px] bg-white/60 backdrop-blur-md border border-white/60 shadow-glass-soft flex flex-col">
          <h3 className="text-lg font-medium text-text-sub mb-4">Spectrogram 분석</h3>
          <div className="flex-1 bg-black/5 rounded-xl overflow-hidden flex items-center justify-center min-h-[200px]">
            {output.spectrogram?.url ? (
              <img 
                src={output.spectrogram.url} 
                alt="Spectrogram" 
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-text-soft">이미지를 불러올 수 없습니다.</span>
            )}
          </div>
          <p className="text-xs text-text-soft mt-2 text-right">
            * 보안을 위해 링크는 {output.spectrogram?.expiresInSec || 0}초 후 만료됩니다.
          </p>
        </div>
      </div>

      {/* 3. 증거 리스트 (Evidence Cards) */}
      <div className="p-8 rounded-[24px] bg-white/60 backdrop-blur-md border border-white/60 shadow-glass-soft">
        <h3 className="text-xl font-bold text-text-main mb-6">탐지된 이상 징후</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {output.evidence.map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-paper/50 border border-primary/10 hover:border-primary/30 transition-colors">
              <div className="text-xs font-bold text-primary mb-1">{item.code}</div>
              <div className="text-sm text-text-main">{item.message}</div>
            </div>
          ))}
          {output.evidence.length === 0 && (
             <div className="col-span-3 text-center text-text-sub py-4">
               특이 사항이 발견되지 않았습니다.
             </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-center pt-8">
        <button 
          onClick={() => window.location.reload()}
          className="px-8 py-3 rounded-full bg-primary text-white font-bold hover:bg-primary-dark transition-all shadow-lg hover:shadow-primary/30"
        >
          다른 파일 분석하기
        </button>
      </div>
    </div>
  );
};

// ================= Main Page Logic =================

export default function AudioPage() {
  const [status, setStatus] = useState("idle"); // idle, analyzing, success, error
  const [result,pRseult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // 에러 코드별 사용자 메시지 매핑
  const handleError = (err) => {
    let msg = "서버 통신 중 오류가 발생했습니다.";
    if (err.errorCode === "AUDIO_TOO_SHORT") msg = "음성이 너무 짧습니다. (최소 5초 이상)";
    else if (err.errorCode === "FILE_TOO_LARGE") msg = "파일 크기가 너무 큽니다. 구간을 잘라서 올려주세요.";
    else if (err.errorCode === "UNSUPPORTED_FORMAT") msg = "지원하지 않는 파일 형식입니다. (mp3, wav, m4a)";
    else if (err.status === 504) msg = "분석 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.";
    
    setErrorMsg(msg);
    setStatus("error");
  };

  const handleFileSelect = async (file) => {
    setStatus("analyzing");
    setErrorMsg(null);

    try {
      const data = await analyzeAudio(file);
      // 성공 처리
      setTimeout(() => { // UX를 위해 아주 짧은 지연 (선택사항)
        pRseult(data);
        setStatus("success");
      }, 500);
    } catch (err) {
      console.error(err);
      handleError(err);
    }
  };

  return (
    <div className="min-h-screen bg-paper relative overflow-x-hidden">
        {/* 배경 그라데이션 (MainPage와 동일) */}
        <div 
          className="fixed inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(
                ellipse 80% 70% at 50% 40%,
                var(--color-paper) 0%,
                rgba(255,255,255,0.95) 25%,
                color-mix(in srgb, var(--color-primary-soft) 30%, transparent) 50%,
                color-mix(in srgb, var(--color-primary-sky) 40%, transparent) 75%,
                color-mix(in srgb, var(--color-primary-mint) 45%, transparent) 100%
              )
            `,
          }}
        />

      {/* 네비게이션 */}
      <nav className="relative px-6 sm:px-10 lg:px-12 py-8 flex justify-between items-center max-w-6xl mx-auto z-10">
        <Link to="/" className="text-base sm:text-lg tracking-wider text-primary/70 font-bold">
          FAKE HUNTERS
        </Link>
        <div className="hidden sm:flex gap-8 text-sm tracking-wider text-primary">
            {/* 현재 페이지 표시를 위해 Audio만 opacity-100 */}
             <Link to="/audio" className="opacity-100 font-bold border-b-2 border-primary">Audio</Link>
             <Link to="/video" className="opacity-70 hover:opacity-100">Video</Link>
             <Link to="/image" className="opacity-70 hover:opacity-100">Image</Link>
             <Link to="/text" className="opacity-70 hover:opacity-100">Text</Link>
        </div>
      </nav>

      {/* 메인 컨텐츠 영역 */}
      <main className="relative z-10 px-6 pt-10 pb-20 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-text-main mb-4 tracking-tight">
            Audio Deepfake Detection
          </h1>
          <p className="text-text-sub text-lg">
            의심되는 음성 파일을 업로드하세요. <br className="hidden sm:block"/>
            AI가 주파수 패턴과 무음 구간을 분석하여 진위 여부를 판별합니다.
          </p>
        </div>

        {/* 상태에 따른 UI 렌더링 */}
        <div className="transition-all duration-500 ease-in-out">
          {status === "idle" && (
            <div className="animate-fade-up">
              <AudioUploadForm onFileSelect={handleFileSelect} isAnalyzing={false} />
            </div>
          )}

          {status === "analyzing" && (
             <LoadingPanel />
          )}

          {status === "error" && (
            <div className="text-center animate-fade-up">
               <div className="p-6 rounded-xl bg-red-50 border border-red-100 text-red-600 mb-6 inline-block">
                 ⚠️ {errorMsg}
               </div>
               <div>
                 <button 
                    onClick={() => setStatus('idle')}
                    className="text-primary hover:underline underline-offset-4"
                 >
                   다시 시도하기
                 </button>
               </div>
            </div>
          )}

          {status === "success" && result && (
            <ResultPanel result={result} />
          )}
        </div>
      </main>
    </div>
  );
}