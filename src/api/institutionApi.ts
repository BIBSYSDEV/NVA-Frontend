import Axios from 'axios';
import { getIdToken } from './userApi';
import mockInstitutionResponse from '../utils/testfiles/institution_query.json';
import { emptyRecursiveUnit, RecursiveUnit, UnitResponse } from '../types/institution.types';

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

export const getParentUnits = async (subunitid: string) => {
  // TODO: get institutions from endpoint
  // BACKEND NOT FINISHED YET
  const idToken = await getIdToken();
  const headers = {
    Authorization: `Bearer ${idToken}`,
  };
  const url = `${InstituionApiPaths.INSTITUTION}?id=${subunitid}`;
  try {
    const response = await Axios.get(url, { headers });
    let unit: RecursiveUnit = emptyRecursiveUnit;
    const { id, name, subunits } = response.data;
    unit.id = id;
    unit.name = name;

    if (subunits.length > 0) {
      unit.subunits = flatSubunits(subunits);
      return unit;
    } else {
      return response.data;
    }
  } catch {
    return null;
  }
};

const flatSubunits = (subunitsList: UnitResponse[]) => {
  let subunits = [];
  if (subunitsList.length > 0) {
    subunits.push(getSubunitObjectFromList(subunitsList));
    if (subunitsList[0].subunits?.length > 0) {
      subunits.push(getSubunitObjectFromList(subunitsList[0].subunits));
      if (subunitsList[0].subunits[0].subunits?.length > 0) {
        subunits.push(getSubunitObjectFromList(subunitsList[0].subunits[0].subunits));
      }
    }
  }
  return subunits;
};

const getSubunitObjectFromList = (list: UnitResponse[]) => {
  return {
    id: list[0].id,
    name: list[0].name,
  };
};
