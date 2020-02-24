import Axios from 'axios';
import { getIdToken } from './userApi';
import mockInstitutionResponse from '../utils/testfiles/institution_query.json';

export enum InstituionApiPaths {
  INSTITUTION = '/cristin-institutions',
  UNIT = '/cristin-institutions/unit',
}

export const getInstitutionAndSubunits = async (searchTerm: string) => {
  // TODO: get institutions from endpoint
  // BACKEND NOT FINISHED YET
  // const idToken = await getIdToken();
  // const headers = {
  //   Authorization: `Bearer ${idToken}`,
  // };
  // const url = `${InstituionApiPaths.INSTITUTION}?name=${searchTerm}`;

  // try {
  //   const response = await Axios.get(url, { headers });
  //   return response.data;
  // } catch {
  //   return null;
  // }
  return mockInstitutionResponse;
};

export const getParentInstitutions = async (subunitid: string) => {
  // TODO: get institutions from endpoint
  // BACKEND NOT FINISHED YET
  const idToken = await getIdToken();
  const headers = {
    Authorization: `Bearer ${idToken}`,
  };
  const url = `${InstituionApiPaths.INSTITUTION}?id=${subunitid}`;
  try {
    const response = await Axios.get(url, { headers });
    return response.data;
  } catch {
    return null;
  }
};
