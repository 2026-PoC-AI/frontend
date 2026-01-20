// src/hooks/image/useImageResultPoll.js
import { useEffect } from "react";
import { getImageAnalysisResult } from "../../api/imageApi";
import { useImageStore } from "../../store/image/imageStore";

export default function useImageResultPoll() {
  const { analysisId, setResult, setAnalyzing, setStep, result } = useImageStore();

  useEffect(() => {
    if (!analysisId || result) return;

    let alive = true;
    let timer = null;

    const poll = async () => {
      try {
        const res = await getImageAnalysisResult(analysisId);
        if (!alive) return;

        const status = res?.job?.status;

        if (status === "ANALYZED" || status === "REPORT_READY") {
          setResult(res);
          setAnalyzing(false);
          setStep("summary");
          return;
        }

        if (status === "FAILED") {
          setAnalyzing(false);
          return;
        }

        timer = setTimeout(poll, 1200);
      } catch (e) {
        console.error("[poll error]", e);
        timer = setTimeout(poll, 1500);
      }
    };

    poll();

    return () => {
      alive = false;
      if (timer) clearTimeout(timer);
    };
  }, [analysisId, result, setResult, setAnalyzing, setStep]);
}
