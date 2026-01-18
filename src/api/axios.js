//api/axios.js
// 로그인 도입시 interceptor 확장 예정
import axios from "axios";
import { API_BASE } from "../utils/env";

const axiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
