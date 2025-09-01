import { RefObject, useEffect } from "react";
import axiosClient from "./axiosClient";
import axios from "axios";

let interceptorsAttached = false;

type AuthInterceptorParams = {
  token: string | null;
  refreshToken: string | null;
  setAuthTokens: (accessToken: string, refreshToken: string) => void;
  latestAccessTokenRef: RefObject<string | null>;
  logout: () => void;
};

export const useAxiosAuthInterceptor = ({
  token,
  refreshToken,
  setAuthTokens,
  latestAccessTokenRef,
  logout,
}: AuthInterceptorParams) => {
  useEffect(() => {
    if (interceptorsAttached) return;
    interceptorsAttached = true;

    let isRefreshing = false;
    type FailedRequest = {
      resolve: (token: string | null) => void;
      reject: (error: unknown) => void;
    };

    let failedQueue: FailedRequest[] = [];

    const processQueue = (error: unknown, newToken: string | null = null) => {
      failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve(newToken);
      });
      failedQueue = [];
    };

    const requestInterceptor = axiosClient.interceptors.request.use(
      (config) => {
        const accessToken = latestAccessTokenRef.current;
        if (accessToken && config.headers) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axiosClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          refreshToken
        ) {
          originalRequest._retry = true;

          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({
                resolve: (newToken: string | null) => {
                  originalRequest.headers[
                    "Authorization"
                  ] = `Bearer ${newToken}`;
                  resolve(axiosClient(originalRequest));
                },
                reject,
              });
            });
          }

          isRefreshing = true;

          try {
            const res = await axios.post(
              `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"}/api/v1/refresh`,
              { refresh_token: refreshToken }
            );

            const newAccessToken = res.data.access_token;
            const newRefreshToken = res.data.refresh_token;

            setAuthTokens(newAccessToken, newRefreshToken);

            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: `Bearer ${newAccessToken}`,
            };

            processQueue(null, newAccessToken);
            return axiosClient(originalRequest);
          } catch (refreshError) {
            processQueue(refreshError, null);
            logout();
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosClient.interceptors.request.eject(requestInterceptor);
      axiosClient.interceptors.response.eject(responseInterceptor);
      interceptorsAttached = false;
    };
  }, [token, refreshToken, setAuthTokens, logout, latestAccessTokenRef]);
};
