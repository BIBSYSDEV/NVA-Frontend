import Axios from 'axios';

import { Institution, InstitutionName, InstitutionSubUnit } from '../types/references.types';

export enum InstituionApiPaths {
  SEARCH = '/institution',
  GET = '/institution/',
}

export const queryInstitution = async (searchTerm: string) => {
  try {
    const response = await Axios({
      method: 'GET',
      url: `${InstituionApiPaths.SEARCH}?name=${searchTerm}`,
    });
    return response.data.results;
  } catch {
    return [];
  }
};

export const getInstitutionSubUnit = async (cristinUnitId: string) => {
  try {
    const response = await Axios({
      method: 'GET',
      url: `${InstituionApiPaths.GET}${cristinUnitId}`,
    });
    return response.data.results;
  } catch {
    return [];
  }
};
