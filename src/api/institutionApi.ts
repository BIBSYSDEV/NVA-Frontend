import { CancelToken } from 'axios';
import i18n from '../translations/i18n';
import { InstitutionUnitBase, RecursiveInstitutionUnit } from '../types/institution.types';
import { LanguageCodes } from '../types/language.types';
import { apiRequest } from './apiRequest';

export enum InstitutionApiPaths {
  INSTITUTIONS = '/institution/institutions',
  DEPARTMENTS = '/institution/departments',
}

const getLanguageCodeForInstitution = () => {
  const currentLanguage = i18n.language;
  if (currentLanguage === LanguageCodes.NORWEGIAN_BOKMAL || currentLanguage === LanguageCodes.NORWEGIAN_NYNORSK) {
    return 'nb';
  } else {
    return 'en';
  }
};

export const getInstitutions = async (cancelToken?: CancelToken) =>
  await apiRequest<InstitutionUnitBase[]>({
    url: `${InstitutionApiPaths.INSTITUTIONS}?language=${getLanguageCodeForInstitution()}`,
    method: 'GET',
    cancelToken,
  });

export const getDepartment = async (departmentUri: string, cancelToken?: CancelToken) =>
  await apiRequest<RecursiveInstitutionUnit>({
    url: `${InstitutionApiPaths.DEPARTMENTS}?uri=${encodeURIComponent(
      departmentUri
    )}&language=${getLanguageCodeForInstitution()}`,
    method: 'GET',
    cancelToken,
  });
