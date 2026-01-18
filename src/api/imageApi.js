import axios from "./axios";


/**
 * 이미지 분석 요청 생성
 * POST /api/v1/images/analyze
 */
export async function analyzeImage(payload) {
  const res = await axios.post(
    "/api/v1/images/analyze",
    payload
  );

  return res.data; // { analysisId }
}

/**
 * 이미지 분석 결과 조회
 * GET /api/v1/images/{jobUuid}
 */
export async function getImageAnalysisResult(jobUuid) {
  const res = await axios.get(
    `/api/v1/images/${jobUuid}`
  );

  return res.data;
}

export default {
  analyzeImage,
  getImageAnalysisResult,
};
