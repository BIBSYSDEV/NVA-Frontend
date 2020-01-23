import Axios from 'axios';
import { API_URL } from './../utils/constants';

export enum InstituionApiPaths {
  QUERY = '/institution',
  GET = '/institution/unit/',
}

export const queryInstitution = async (searchTerm: string) => {
  try {
    const response = await Axios({
      method: 'GET',
      url: `${API_URL}${InstituionApiPaths.QUERY}?name=${searchTerm}`,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    return [];
  }
};

export const getInstitutionSubUnit = async (cristinUnitId: string) => {
  try {
    const response = await Axios({
      method: 'GET',
      url: `${API_URL}${InstituionApiPaths.GET}${cristinUnitId}`,
    });
    return response.data;
  } catch {
    return [];
  }
};
