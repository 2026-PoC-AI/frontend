const { VITE_API_URL, VITE_AI_SERVICE_URL } = import.meta.env;

export const API_CONFIG = {
    BASE_URL: VITE_API_URL || 'http://localhost:8080',
    AI_SERVICE_URL: VITE_AI_SERVICE_URL || 'http://localhost:8001',
    TIMEOUT: 60000,
};