import { useAuthStore } from '@/store/auth/useAuthStore';
import axios, { AxiosError } from 'axios';
import { GetTokens } from '@/api/auth/auth';
import API from '@/api/auth/constants';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    platform: 'WEB',
  },
});

let isRefreshing = false;
let subscribers: ((authToken: string) => void)[] = [];

function onRefreshed(authToken: string) {
  subscribers = subscribers.filter(callback => callback(authToken));
}

function subscribeForTokenRefresh(
  callbackFunction: (authToken: string) => void,
) {
  subscribers.push(callbackFunction);
}

function handleTokenRefreshError(e: unknown) {
  useAuthStore.setState({
    isAuthenticated: false,
    accessToken: '',
    expiresIn: 0,
    user: undefined,
  });
  window.location.href = '/';
  return Promise.reject(e);
}

//Axios request interceptor
AxiosInstance.interceptors.request.use(
  config => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      return config;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);
//Axios response interceptor
AxiosInstance.interceptors.response.use(
  config => config,
  async function (error) {
    const { isAuthenticated } = useAuthStore.getState();
    const originalConfig = error.config;

    if (error instanceof AxiosError && originalConfig.url !== API.LOGIN.path) {
      if (
        error.response?.status === 401 &&
        isAuthenticated &&
        !originalConfig._retry
      ) {
        originalConfig._retry = true;

        try {
          const retryOriginalRequest = new Promise(resolve => {
            subscribeForTokenRefresh(authToken => {
              originalConfig.headers.Authorization = `Bearer ${authToken}`;
              resolve(AxiosInstance(originalConfig));
            });
          });

          if (!isRefreshing) {
            isRefreshing = true;
            GetTokens()
              .then(response => {
                if (response.data.statusCode === 201) {
                  useAuthStore.setState({
                    accessToken: response.data?.data.access_token,
                    expiresIn: response.data?.data.expires_in,
                  });
                  isRefreshing = false;
                  onRefreshed(response.data?.data.access_token);
                }
              })
              .catch(e => handleTokenRefreshError(e));
          }

          return await retryOriginalRequest;
        } catch (e) {
          handleTokenRefreshError(e);
        }
      }
    }

    return Promise.reject(error);
  },
);

export default AxiosInstance;
