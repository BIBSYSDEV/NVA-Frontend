import { CancelToken } from 'axios';
import { apiRequest } from './apiRequest';
import { InstitutionUnitBase, RecursiveInstitutionUnit } from '../types/institution.types';
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

export const getDepartment = async (departmentUri: string, cancelToken?: CancelToken) =>
  await apiRequest<RecursiveInstitutionUnit>({
    url: `${InstitutionApiPaths.DEPARTMENTS}?uri=${encodeURIComponent(departmentUri)}&language=${getLanguageCode()}`,
    method: 'GET',
    cancelToken,
  });
