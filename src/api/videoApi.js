const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const analyzeVideo = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/api/video/analyze`, {
    method: 'POST',
    body: formData,
    });

    if (!response.ok) {
    throw new Error('영상 분석 요청 실패');
    }

    return response.json();
};

export const getAnalysisProgress = async (analysisId) => {
    const response = await fetch(`${API_BASE_URL}/api/video/progress/${analysisId}`);

    if (!response.ok) {
    if (response.status === 404) {
        return null;
    }
    throw new Error('진행률 조회 실패');
    }

    return response.json();
};