import Axios from 'axios';
import { StatusCode } from '../utils/constants';

export enum AlmaApiPaths {
  ALMA = '/alma',
}

export const getAlmaPublication = async (systemControlNumber: string, invertedCreatorName: string) => {
  const url = encodeURI(`${AlmaApiPaths.ALMA}/?scn=${systemControlNumber}&creatorname=${invertedCreatorName}`);
  try {
    const response = await Axios.get(url);

    if (response.status === StatusCode.OK) {
      return response.data;
    }
  } catch (error) {
    return { error };
  }
  return [];
};
