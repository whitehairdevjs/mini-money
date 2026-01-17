import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 응답 인터셉터: 401 에러 시 로그아웃 처리
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 인증 실패 시 로컬 스토리지 정리
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        delete apiClient.defaults.headers.common["Authorization"];
        // 로그인 페이지로 리다이렉트
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

