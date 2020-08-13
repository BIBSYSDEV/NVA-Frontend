import Axios, { CancelToken } from 'axios';
import { StatusCode } from '../utils/constants';
import i18n from '../translations/i18n';
import apiRequest from './apiRequest';

export enum InstitutionApiPaths {
  INSTITUTIONS = '/institution/institutions',
  DEPARTMENTS = '/institution/departments',
}

export const getInstitutions = async (cancelToken?: CancelToken) => {
  const response = await apiRequest({
    url: InstitutionApiPaths.INSTITUTIONS,
    method: 'GET',
    cancelToken,
  });

  return response;
};

export const getDepartment = async (departmentUri: string, cancelToken?: CancelToken) => {
  const url = `${InstitutionApiPaths.DEPARTMENTS}?uri=${departmentUri}`;
  try {
    const response = await Axios.get(url, { cancelToken });
    if (response.status === StatusCode.OK) {
      return response.data;
    } else {
      return { error: i18n.t('feedback:error.get_institution') };
    }
  } catch (error) {
    if (!Axios.isCancel(error)) {
      return { error: i18n.t('feedback:error.get_institution') };
    }
  }
};
