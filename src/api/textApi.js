import axios from './axios';

export const analyzeText = async (payload) => {
  // 가이드라인 F-01: 뉴스 텍스트 분석 요청
  const response = await axios.post('/api/v1/text/analyze', payload);
  return response.data;
};