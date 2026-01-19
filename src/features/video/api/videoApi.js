const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const analyzeVideo = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/api/video/analyze`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || '분석 중 오류가 발생했습니다.');
    }

    return await response.json();
};