import axios from "./axios";

/**
 * @param {{ text: string, evidence_k: number, include_references: boolean }} payload
 * @returns {Promise<{
 *  label: string,
 *  score: number,
 *  evidences: {text: string, score?: number}[],
 *  highlights: {start: number, end: number, text: string, weight: number}[],
 *  references: {title: string, url: string, snippet?: string}[]
 * }>}
 */
export const analyzeText = async (payload) => {
  const res = await axios.post("/api/v1/text/analyze", payload);
  return res.data; 
};
