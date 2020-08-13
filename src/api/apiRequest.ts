import Axios, { AxiosRequestConfig } from 'axios';

import { getIdToken } from './userApi';
import { StatusCode } from '../utils/constants';
import { setAxiosDefaults } from '../utils/axios-config';

// Set axios defaults only once through the app's lifetime
setAxiosDefaults();

// A completed request should return error:true|false alongside potential data
interface CompletedApiResponse {
  error: boolean;
  data?: any;
}
// A cancelled request should return null
type ApiResponse = CompletedApiResponse | null;

export const authenticatedApiRequest = async (axiosRequestConfig: AxiosRequestConfig): Promise<ApiResponse> => {
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

export const apiRequest = async (axiosRequestConfig: AxiosRequestConfig): Promise<ApiResponse> => {
  try {
    const response = await Axios(axiosRequestConfig);

    if (response.status === StatusCode.OK) {
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

export default apiRequest;
