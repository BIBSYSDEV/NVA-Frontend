import Axios from 'axios';
import { getIdToken } from './userApi';

export enum InstituionApiPaths {
  INSTITUTION = '/cristin-institutions',
  UNIT = '/cristin-institutions/unit',
}

export const getInstitutionAndSubunits = async (searchTerm: string) => {
  const idToken = await getIdToken();
  const headers = {
    Authorization: `Bearer ${idToken}`,
  };
  const url = `${InstituionApiPaths.INSTITUTION}?name=${searchTerm}`;

  try {
    const response = await Axios.get(url, { headers });
    return response.data;
  } catch {
    return null;
  }
};
