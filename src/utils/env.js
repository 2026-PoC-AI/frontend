const {
  VITE_API_URL,
  VITE_AI_SERVICE_URL,
} = import.meta.env;

export const API_BASE = VITE_API_URL || "http://localhost:8080";
export const AI_SERVICE_BASE =
  VITE_AI_SERVICE_URL || "http://localhost:8001";

export const IS_DEV = import.meta.env.DEV;
