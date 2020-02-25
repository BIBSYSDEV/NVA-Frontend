import Axios from 'axios';
import { getIdToken } from './userApi';
import mockInstitutionResponse from '../utils/testfiles/institution_query.json';
import { UnitResponseType, UnitBase, RecursiveUnit } from '../types/institution.types';

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
    const { id, name, subunits } = response.data;

    if (subunits.length > 0) {
      let unit: RecursiveUnit = { name: '', id: '', subunits: [] };
      unit.id = id;
      unit.name = name;
      unit.subunits = getSubunits(subunits);
      return unit;
    } else {
      return response.data;
    }
  } catch {
    return null;
  }
};

// inspired by https://stackoverflow.com/questions/48171842/how-to-write-a-recursive-flat-map-in-javascript
const getSubunits = (subunits: UnitResponseType[]) => {
  let list: UnitBase[] = [{ id: subunits[0].id, name: subunits[0].name }];
  return subunits.flatMap(function loop(node: UnitResponseType): any {
    if (node.subunits?.length > 0) {
      list.push({ id: node.subunits[0].id, name: node.subunits[0].name });
      if (node.subunits?.length > 0) {
        return node.subunits.flatMap(loop);
      }
    }
    return list;
  });
};
