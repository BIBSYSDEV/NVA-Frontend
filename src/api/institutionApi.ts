import Axios from 'axios';
import { getIdToken } from './userApi';
import { InstitutionUnitResponseType, InstitutionUnitBase } from '../types/institution.types';
import { StatusCode } from '../utils/constants';
import i18n from '../translations/i18n';

export enum InstituionApiPaths {
  INSTITUTIONS = '/institutions-proxy/institutions',
  DEPARTMENTS = '/institutions-proxy/departments',
}

export const getInstitutions = async () => {
  const url = InstituionApiPaths.INSTITUTIONS;
  try {
    const idToken = await getIdToken();
    const headers = {
      Authorization: `Bearer ${idToken}`,
    };
    const response = await Axios.get(url, { headers });
    if (response.status === StatusCode.OK) {
      return response.data;
    } else {
      return i18n.t('feedback:error.get_institutions');
    }
  } catch {
    return i18n.t('feedback:error.get_institutions');
  }
};

export const getDepartment = async (departmentUri: string) => {
  const url = `${InstituionApiPaths.DEPARTMENTS}?uri=${departmentUri}`;
  try {
    const idToken = await getIdToken();
    const headers = {
      Authorization: `Bearer ${idToken}`,
    };
    const response = await Axios.get(url, { headers });
    if (response.status === StatusCode.OK) {
      return response.data;
    } else {
      return i18n.t('feedback:error.get_institution');
    }
  } catch {
    return i18n.t('feedback:error.get_institution');
  }
};

export const getParentUnits = async (subunitid: string) => {
  // TODO: get institutions from endpoint
  // BACKEND NOT FINISHED YET
  try {
    const idToken = await getIdToken();
    const headers = {
      Authorization: `Bearer ${idToken}`,
    };
    const url = `${InstituionApiPaths.INSTITUTIONS}?id=${subunitid}`;
    const response = await Axios.get(url, { headers });
    if (response.status === StatusCode.OK) {
      const { id, name, subunits } = response.data;

      if (subunits.length > 0) {
        return { name, id, subunits: getSubunits(subunits) };
      } else {
        return response.data;
      }
    } else {
      return null;
    }
  } catch {
    return { error: i18n.t('feedback:error.get_parent_units') };
  }
};

// inspired by https://stackoverflow.com/questions/48171842/how-to-write-a-recursive-flat-map-in-javascript
const getSubunits = (subunits: InstitutionUnitResponseType[]) => {
  let list: InstitutionUnitBase[] = [{ id: subunits[0].id, name: subunits[0].name }];
  return subunits.flatMap(function loop(node: InstitutionUnitResponseType): any {
    if (node.subunits?.length > 0) {
      list.push({ id: node.subunits[0].id, name: node.subunits[0].name });
      if (node.subunits?.length > 0) {
        return node.subunits.flatMap(loop);
      }
    }
    return list;
  });
};
