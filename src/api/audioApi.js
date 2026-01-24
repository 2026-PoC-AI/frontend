import axios from "./axios";

/**
 * 오디오 업로드
 * Presigned S3 업로드 완료 후 DB 등록
 * POST /api/audio/upload
 */
export async function uploadAudio({ s3Key, file }) {
  const res = await axios.post("/api/audio/upload", {
    s3Key,
    fileName: file.name,
    fileSize: file.size,
    contentType: file.type,
  });

  return res.data;
}

/**
 * 오디오 분석 요청
 * POST /api/audio/{audioFileId}/analyze
 */
export async function analyzeAudio(audioFileId) {
  const res = await axios.post(
    `/api/audio/${audioFileId}/analyze`
  );
  return res.data;
}

/**
 * 오디오 분석 결과 조회
 * GET /api/audio/{audioFileId}/result
 */
export async function getAudioResult(audioFileId) {
  const res = await axios.get(
    `/api/audio/${audioFileId}/result`
  );
  return res.data;
}

/**
 * 오디오 파일 정보 조회
 * GET /api/audio/{audioFileId}
 */
export async function getAudioFileInfo(audioFileId) {
  const res = await axios.get(
    `/api/audio/${audioFileId}`
  );
  return res.data;
}

/**
 * 오디오 히스토리 조회
 * GET /api/audio/list
 */
export async function getAudioHistory() {
  const res = await axios.get(
    "/api/audio/list"
  );
  return res.data;
}

/**
 * 오디오 삭제
 * DELETE /api/audio/{audioFileId}
 */
export async function deleteAudio(audioFileId) {
  const res = await axios.delete(
    `/api/audio/${audioFileId}`
  );
  return res.data;
}

export default {
  uploadAudio,
  analyzeAudio,
  getAudioResult,
  getAudioFileInfo,
  getAudioHistory,
  deleteAudio,
};
