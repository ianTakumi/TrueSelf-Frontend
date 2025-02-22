import axios from "axios";

const AxiosAIInstance = axios.create({
  baseURL: "http://localhost:4000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default AxiosAIInstance;
