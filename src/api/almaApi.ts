import { CancelToken } from 'axios';
import { apiRequest } from './apiRequest';
import { AlmaRegistration } from '../types/registration.types';

enum AlmaApiPaths {
  ALMA = '/alma',
}

export const getAlmaRegistration = async (arpId: string, invertedCreatorName: string, cancelToken?: CancelToken) => {
  const systemControlNumber = arpId.split('/').pop();
  const url = encodeURI(`${AlmaApiPaths.ALMA}/?scn=${systemControlNumber}&creatorname=${invertedCreatorName}`);
  return await apiRequest<AlmaRegistration>({
    url,
    method: 'GET',
    cancelToken,
  });
};
