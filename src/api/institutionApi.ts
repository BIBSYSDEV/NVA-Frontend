import { CancelToken } from 'axios';
import { InstitutionUnitBase, RecursiveInstitutionUnit } from '../types/institution.types';
import { getPreferredLanguageCode } from '../utils/translation-helpers';
import { apiRequest } from './apiRequest';

export enum InstitutionApiPaths {
  INSTITUTIONS = '/institution/institutions',
  DEPARTMENTS = '/institution/departments',
}

export const getInstitutions = async (cancelToken?: CancelToken) =>
  await apiRequest<InstitutionUnitBase[]>({
    url: `${InstitutionApiPaths.INSTITUTIONS}?language=${getPreferredLanguageCode()}`,
    method: 'GET',
    cancelToken,
  });

export const getDepartment = async (departmentUri: string, cancelToken?: CancelToken) =>
  await apiRequest<RecursiveInstitutionUnit>({
    url: `${InstitutionApiPaths.DEPARTMENTS}?uri=${encodeURIComponent(
      departmentUri
    )}&language=${getPreferredLanguageCode()}`,
    method: 'GET',
    cancelToken,
  });
