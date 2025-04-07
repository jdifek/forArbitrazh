import axios from "axios";
import axiosRetry from "axios-retry";
import TokenService from "./Token/TokenService";

export const API_URL = import.meta.env.VITE_API_URL;

// Основной экземпляр axios для запросов
const $api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Флаг для отслеживания процесса обновления токена
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

// 🔹 **Перехват запросов** – подставляем токен
$api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  console.log("🔹 Attaching authToken to request:", token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🔹 **Перехват ответов** – обновляем токен при 401
$api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Если получили 401 и это не повторная попытка
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== `${API_URL}/token/refresh/`
    ) {
      originalRequest._retry = true;
      console.log("🔴 401 detected, attempting token refresh...");

      if (isRefreshing) {
        // Если уже идет обновление токена, ставим запрос в очередь
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return $api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        console.log("🔹 Current refreshToken:", refreshToken);

        if (!refreshToken) {
          throw new Error("🔴 No refresh token available");
        }

        console.log("🔄 Trying to refresh token...");
        const response = await TokenService.refreshToken({
          refresh: refreshToken,
        });
        console.log("✅ Refresh token response:", response);

        const newAccessToken = response.data?.access;
        if (!newAccessToken) {
          console.log("⚠️ No access token received! Logging out...");
          localStorage.removeItem("authToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/"; // Теперь точно редирект
          return Promise.reject(
            new Error("🔴 No access token received from refresh")
          );
        }

        // Сохраняем новый токен
        localStorage.setItem("authToken", newAccessToken);

        // Разрешаем все запросы в очереди с новым токеном
        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return $api(originalRequest);
      } catch (refreshError) {
        console.error("❌ Token refresh failed:", refreshError);
        console.log("🔴 Status:", refreshError.response?.status);
        console.log("🔴 Response:", refreshError.response);

        // Обрабатываем случай отсутствия refreshToken или 401 от сервера
        if (
          refreshError.message === "🔴 No refresh token available" ||
          refreshError.response?.status === 401
        ) {
          console.log("🔴 Processing auth failure...");
          localStorage.removeItem("authToken");
          localStorage.removeItem("refreshToken");

          processQueue(refreshError);

          // Вызываем глобальное событие для открытия модалки
          console.log("⚡ Dispatching auth failure event...");
          window.dispatchEvent(new Event("auth-failure"));
        } else {
          processQueue(refreshError);
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// 🔄 **Настройка axios-retry** для ошибок 5xx
axiosRetry($api, {
  retries: 3,
  retryDelay: (retryCount) => retryCount * 1000,
  shouldResetTimeout: true,
  retryCondition: (error) => {
    return error.response?.status >= 500 && error.response?.status <= 599;
  },
});

// 🔥 **Глобальный обработчик ошибок**
window.addEventListener("error", (event) => {
  console.error("🌍 Global error caught:", event.error);
});
window.addEventListener("unhandledrejection", (event) => {
  console.error("🌍 Unhandled Promise rejection:", event.reason);
});

export default $api;

/* вариант без автоматического обновления accessToken */
// import axios from 'axios'

// export const API_URL = import.meta.env.VITE_API_URL

// const $api = axios.create({
// 	baseURL: API_URL, // Base URL for all requests
// 	headers: {
// 		'Content-Type': 'application/json', // Set JSON as the content type
// 	},
// })

// // Add a request interceptor to attach the token dynamically
// $api.interceptors.request.use(
// 	config => {
// 		const token = localStorage.getItem('authToken') // Retrieve token from localStorage
// 		if (token) {
// 			config.headers.Authorization = `Bearer ${token}` // Attach token to Authorization header
// 		}
// 		return config
// 	},
// 	error => {
// 		return Promise.reject(error)
// 	}
// )

// export default $api
