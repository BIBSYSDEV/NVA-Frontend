import Axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import { getIdToken } from './userApi';
import { StatusCode } from '../utils/constants';
import { setAxiosDefaults } from '../utils/axios-config';

// Set axios defaults only once through the app's lifetime
setAxiosDefaults();

// A completed request should return error:true|false alongside potential data
interface CompletedApiResponse<T> {
  error: boolean;
  data?: T;
}
// A cancelled request should return null
type ApiResponse<T> = CompletedApiResponse<T> | null;

export const authenticatedApiRequest = async <T>(axiosRequestConfig: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  try {
    const idToken = await getIdToken();
    axiosRequestConfig.headers = {
      ...axiosRequestConfig.headers,
      Authorization: `Bearer ${idToken}`,
    };
  } catch {
    return {
      error: true,
    };
  }

  return await apiRequest(axiosRequestConfig);
};

export const apiRequest = async <T>(axiosRequestConfig: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  try {
    const response = await Axios(axiosRequestConfig);

    if (response.status === StatusCode.OK || response.status === StatusCode.CREATED) {
      return { error: false, data: response.data };
    } else if (response.status >= 400) {
      return { error: true };
    } else {
      return { error: false };
    }
  } catch (error) {
    return Axios.isCancel(error) ? null : { error: true };
  }
};

export const authenticatedApiRequest2 = async <T>(
  axiosRequestConfig: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  const idToken = await getIdToken();
  axiosRequestConfig.headers = {
    ...axiosRequestConfig.headers,
    Authorization: `Bearer ${idToken}`,
  };

  return await apiRequest2(axiosRequestConfig);
};

export const apiRequest2 = async <T>(axiosRequestConfig: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
  await Axios(axiosRequestConfig);
