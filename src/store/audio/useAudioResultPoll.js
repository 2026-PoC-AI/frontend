import { useEffect, useRef, useState } from "react";
import { getAudioResult } from "../../api/audioApi";

export default function useAudioResultPoll(audioFileId, options = {}) {
  const {
    interval = 2000,
    maxRetry = 60,
  } = options;

  const [result, setResult] = useState(null);
  const [status, setStatus] = useState(
    audioFileId ? "PROCESSING" : null
  );
  const [error, setError] = useState(null);

  const timerRef = useRef(null);
  const retryRef = useRef(0);
  const stoppedRef = useRef(false);

  useEffect(() => {
    if (!audioFileId) return;

    retryRef.current = 0;
    stoppedRef.current = false;

    const stopPolling = () => {
      stoppedRef.current = true;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };

    const poll = async () => {
      if (stoppedRef.current) return;

      try {
        const res = await getAudioResult(audioFileId); 
        const rawStatus = res?.status;                 
        const normalizedStatus = rawStatus?.toLowerCase();

        if (normalizedStatus === "completed") {
          setResult(res);
          setStatus("COMPLETED");
          stopPolling();
          return;
        }
        if (normalizedStatus === "failed") {
          setStatus("FAILED");
          setError("Analysis failed");
          stopPolling();
          return;
        }

        retryRef.current += 1;
        if (retryRef.current >= maxRetry) {
          setStatus("FAILED");
          setError("Analysis timeout");
          stopPolling();
          return;
        }

        timerRef.current = setTimeout(poll, interval);
      } catch (e) {
        console.error(e);
        setStatus("FAILED");
        setError("Polling error");
        stopPolling();
      }
    };

    poll();

    return () => {
      stopPolling();
    };
  }, [audioFileId, interval, maxRetry]);

  return { result, status, error };
}
