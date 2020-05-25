import Axios, { CancelToken } from 'axios';
import { getIdToken } from './userApi';
import { StatusCode } from '../utils/constants';
import i18n from '../translations/i18n';

export enum InstitutionApiPaths {
  INSTITUTIONS = '/institution/institutions',
  DEPARTMENTS = '/institution/departments',
}

export const getInstitutions = async (cancelToken?: CancelToken) => {
  const url = InstitutionApiPaths.INSTITUTIONS;
  try {
    const idToken = await getIdToken();
    const headers = {
      Authorization: `Bearer ${idToken}`,
    };
    const response = await Axios.get(url, { headers, cancelToken });

    if (response.status === StatusCode.OK) {
      return response.data;
    } else {
      return { error: i18n.t('feedback:error.get_institutions') };
    }
  } catch (error) {
    if (!Axios.isCancel(error)) {
      return { error: i18n.t('feedback:error.get_institutions') };
    }
  }
};

export const getDepartment = async (departmentUri: string, cancelToken?: CancelToken) => {
  const url = `${InstitutionApiPaths.DEPARTMENTS}?uri=${departmentUri}`;
  try {
    const idToken = await getIdToken();
    const headers = {
      Authorization: `Bearer ${idToken}`,
    };
    const response = await Axios.get(url, { headers, cancelToken });
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
