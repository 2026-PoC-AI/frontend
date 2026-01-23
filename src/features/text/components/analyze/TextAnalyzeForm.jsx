import React, { useState } from 'react';

const TextAnalyzeForm = ({ onAnalysisStart, loading }) => {
  const [formData, setFormData] = useState({
    text: '',
    sourceUrl: '',
    isNational: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.text.trim()) return;
    onAnalysisStart(formData);
  };

  return (
    // m-2를 추가하여 그림자가 부모 컨테이너에 의해 잘리는 것을 방지합니다.
    <div className="w-full max-w-2xl mx-auto p-8 rounded-[24px] bg-white/70 backdrop-blur-md shadow-glass-soft animate-fade-up m-2">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 뉴스 본문 입력 */}
        <div className="border-2 border-dashed border-primary/40 rounded-xl p-6 transition-colors hover:border-primary/60 hover:bg-primary/5 group">
          <label className="block mb-2 text-sm font-bold text-text-main group-hover:opacity-100 transition-opacity font-noto text-left">
            뉴스 본문 입력
          </label>
          <textarea
            className="w-full h-48 bg-transparent outline-none resize-none text-text-main placeholder:text-text-main/30 font-noto"
            placeholder="분석할 기사 내용을 이곳에 입력하거나 붙여넣으세요..."
            value={formData.text}
            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
          />
        </div>

        {/* URL 입력 */}
        <input
          type="url"
          className="w-full p-3 rounded-xl bg-white/60 border border-primary/10 focus:border-primary/40 outline-none text-sm text-text-main"
          placeholder="기사 원문 URL (선택사항)"
          value={formData.sourceUrl}
          onChange={(e) => setFormData({ ...formData, sourceUrl: e.target.value })}
        />

        {/* 체크박스 */}
        <div 
          className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
            formData.isNational ? 'bg-primary/15 border-primary/40' : 'bg-white/50 border-white/60'
          }`}
          onClick={() => setFormData({ ...formData, isNational: !formData.isNational })}
        >
          <div className={`mt-1 w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 ${
            formData.isNational ? 'bg-primary border-primary' : 'bg-white border-primary/40'
          }`}>
            {formData.isNational && <span className="text-white text-[10px]">✓</span>}
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-bold text-text-main">국가적 주요 사안 포함</p>
            <p className="text-xs text-text-main/70 mt-0.5">외신 교차 검증을 통해 왜곡을 분석합니다.</p>
          </div>
        </div>

        {/* 버튼 (그림자가 잘리지 않도록 하단 padding 추가) */}
        <div className="flex justify-center pt-2 pb-2">
          <button
            type="submit"
            disabled={loading || !formData.text.trim()}
            className="px-10 py-3 rounded-full bg-primary text-white font-bold hover:bg-primary-dark transition-all shadow-lg disabled:bg-primary/30"
          >
            {loading ? "분석 중..." : "뉴스 분석 시작하기"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TextAnalyzeForm;