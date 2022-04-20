import Axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import { getAccessToken } from './userApi';
import { setAxiosDefaults } from '../utils/axios-config';

// Set axios defaults only once through the app's lifetime
setAxiosDefaults();

export const authenticatedApiRequest = async <T>(axiosRequestConfig: AxiosRequestConfig) => {
  const token = await getAccessToken();
  axiosRequestConfig.headers = {
    ...axiosRequestConfig.headers,
    Authorization: `Bearer ${token}`,
  };

  return await apiRequest<T>(axiosRequestConfig);
};

export const apiRequest = async <T>(axiosRequestConfig: AxiosRequestConfig) =>
  (await Axios({
    ...axiosRequestConfig,
    validateStatus: () => true, // Handle response status codes instead of catching errors
  })) as unknown as Promise<AxiosResponse<T>>;
