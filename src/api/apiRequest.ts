import Axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import { getIdToken } from './userApi';
import { setAxiosDefaults } from '../utils/axios-config';

// Set axios defaults only once through the app's lifetime
setAxiosDefaults();

export const authenticatedApiRequest = async <T>(axiosRequestConfig: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
  const idToken = await getIdToken();
  axiosRequestConfig.headers = {
    ...axiosRequestConfig.headers,
    Authorization: `Bearer ${idToken}`,
  };

  return await apiRequest(axiosRequestConfig);
};

export const apiRequest = async <T>(axiosRequestConfig: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
  await Axios({
    ...axiosRequestConfig,
    validateStatus: () => true, // Handle response status codes instead of catching errors
  });
