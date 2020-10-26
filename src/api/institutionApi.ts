import Axios, { CancelToken } from 'axios';
import { StatusCode } from '../utils/constants';
import i18n from '../translations/i18n';
import { apiRequest } from './apiRequest';
import { InstitutionUnitBase } from '../types/institution.types';
import { LanguageCodes } from '../types/language.types';

export enum InstitutionApiPaths {
  INSTITUTIONS = '/institution/institutions',
  DEPARTMENTS = '/institution/departments',
}

const getLanguageCode = () => {
  const currentLanguage = localStorage.getItem('i18nextLng');
  if (currentLanguage === LanguageCodes.NORWEGIAN_BOKMAL || currentLanguage === LanguageCodes.NORWEGIAN_NYNORSK) {
    return 'nb';
  } else {
    return 'en';
  }
};

export const getInstitutions = async (cancelToken?: CancelToken) =>
  await apiRequest<InstitutionUnitBase[]>({
    url: `${InstitutionApiPaths.INSTITUTIONS}?language=${getLanguageCode()}`,
    method: 'GET',
    cancelToken,
  });

export const getDepartment = async (departmentUri: string, cancelToken?: CancelToken) => {
  const url = `${InstitutionApiPaths.DEPARTMENTS}?uri=${departmentUri}&language=${getLanguageCode()}`;
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
