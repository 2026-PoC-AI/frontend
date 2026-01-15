// src/api/audioApi.js

export const analyzeAudio = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  // 필요 시 clientRequestId 추가
  // formData.append("clientRequestId", crypto.randomUUID());

  // try-catch 블록 제거
  // fetch나 json()에서 에러가 나면 자동으로 호출자(AudioPage)에게 전파됩니다.
  const response = await fetch("/api/v1/audio/analyze", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  // API 서버가 에러 응답(4xx, 5xx)을 보낸 경우 명시적으로 에러를 던집니다.
  if (!response.ok) {
    throw {
      status: response.status,
      errorCode: data.errorCode || "UNKNOWN_ERROR",
      message: data.message || "알 수 없는 오류가 발생했습니다.",
      details: data.details,
    };
  }

  return data;
};