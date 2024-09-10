import Axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import { setAxiosDefaults } from '../utils/axios-config';
import { getAccessToken } from './authApi';

// Set axios defaults only once through the app's lifetime
setAxiosDefaults();

/**
 * @deprecated Use authenticatedApiRequest2 instead
 */
export const authenticatedApiRequest = async <T>(axiosRequestConfig: AxiosRequestConfig) => {
  const token = await getAccessToken();
  axiosRequestConfig.headers = {
    ...axiosRequestConfig.headers,
    Authorization: `Bearer ${token}`,
  };

  return await apiRequest<T>(axiosRequestConfig);
};

/**
 * @deprecated Use apiRequest2 instead
 */
export const apiRequest = async <T>(axiosRequestConfig: AxiosRequestConfig) =>
  (await Axios({
    ...axiosRequestConfig,
    validateStatus: () => true, // Handle response status codes instead of catching errors
  })) as unknown as Promise<AxiosResponse<T>>;

// The following methods does not ignore exceptions for requests, and should be used with react-query
export const authenticatedApiRequest2 = async <T>(axiosRequestConfig: AxiosRequestConfig) => {
  const token = await getAccessToken();
  axiosRequestConfig.headers = {
    ...axiosRequestConfig.headers,
    Authorization: `Bearer ${token}`,
  };

  return await apiRequest2<T>(axiosRequestConfig);
};

export const apiRequest2 = async <T>(axiosRequestConfig: AxiosRequestConfig) =>
  (await Axios({
    ...axiosRequestConfig,
  })) as unknown as Promise<AxiosResponse<T>>;
