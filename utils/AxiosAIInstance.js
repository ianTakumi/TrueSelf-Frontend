import axios from "axios";

const AxiosAIInstance = axios.create({
  baseURL: import.meta.env.VITE_AI_API_BASE_URL || "http://localhost:4000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default AxiosAIInstance;
