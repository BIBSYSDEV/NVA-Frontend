import { CancelToken } from 'axios';
import { apiRequest, ApiResponse } from './apiRequest';
import { AlmaRegistration } from '../types/registration.types';

enum AlmaApiPaths {
  ALMA = '/alma',
}

export const getAlmaRegistration = async (
  systemControlNumber: string,
  invertedCreatorName: string,
  cancelToken?: CancelToken
): Promise<ApiResponse<AlmaRegistration>> => {
  const url = encodeURI(`${AlmaApiPaths.ALMA}/?scn=${systemControlNumber}&creatorname=${invertedCreatorName}`);
  return await apiRequest<AlmaRegistration>({
    url,
    method: 'GET',
    cancelToken,
  });
};
