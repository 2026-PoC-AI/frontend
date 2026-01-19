import { useImageStore } from "../../../../store/image/imageStore";

export default function ImageFinalReport() {
  const { setStep, result } = useImageStore();

  const analysis = result?.results?.[0];
  const level = analysis?.riskLevel ?? "—";
  const score = analysis?.riskScore ?? 0;

  return (
    <div className="space-y-7">
      <header className="flex justify-between items-start">
        <div>
          <p className="text-xs tracking-widest text-text-soft mb-2">
            FINAL REPORT (PREVIEW)
          </p>
          <h2 className="text-2xl font-extrabold text-text-main leading-tight">
            최종 신뢰 리포트
          </h2>
          <p className="text-sm text-text-soft mt-2">
            Spring AI 연동 전, 화면/UX 검증을 위한 프리뷰 버전입니다.
          </p>
        </div>

        <button
          onClick={() => setStep("summary")}
          className="text-sm text-primary hover:underline"
        >
          요약으로 돌아가기
        </button>
      </header>

      <div className="rounded-2xl bg-white/45 backdrop-blur-xl border border-white/35 p-6">
        <p className="text-xs tracking-widest text-text-soft mb-3">
          OVERALL ASSESSMENT
        </p>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-text-main">
              본 이미지는 <span className="font-semibold">{level}</span> 위험
              수준으로 평가됩니다.
            </p>
            <p className="text-xs text-text-soft mt-2">
              (현재는 mock 기반 서술이며, 추후 LLM 보고서로 대체됩니다.)
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs text-text-soft">RISK SCORE</p>
            <p className="text-3xl font-extrabold text-text-main">{score}</p>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-white/45 backdrop-blur-xl border border-white/35 p-6">
          <p className="text-xs tracking-widest text-text-soft mb-3">
            KEY EVIDENCE
          </p>
          <ul className="text-sm text-text-main space-y-2 list-disc pl-5">
            <li>얼굴 영역의 텍스처 패턴 불일치</li>
            <li>조명 방향과 그림자 간 비자연스러운 관계</li>
            <li>경계선(윤곽) 블렌딩 아티팩트</li>
          </ul>
        </div>

        <div className="rounded-2xl bg-white/45 backdrop-blur-xl border border-white/35 p-6">
          <p className="text-xs tracking-widest text-text-soft mb-3">
            RECOMMENDED ACTIONS
          </p>
          <ul className="text-sm text-text-main space-y-2 list-disc pl-5">
            <li>원본 출처 및 업로드 경로 재확인</li>
            <li>유사 이미지/영상 교차 검증</li>
            <li>메타데이터/압축 흔적 추가 확인</li>
          </ul>
        </div>
      </div>

      <div className="text-xs text-text-soft">
        ※ 본 리포트는 자동 분석/프리뷰 결과이며 참고용입니다.
      </div>
      <div className="flex gap-4 pt-6">
        <button className="flex-1 py-3 rounded-pill bg-primary-dark text-white shadow">
          PDF 다운로드
        </button>
        <button className="flex-1 py-3 rounded-pill bg-white/60 text-text-main">
          공유 링크
        </button>
      </div>
    </div>
  );
}
