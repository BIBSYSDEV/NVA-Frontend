import { CancelToken } from 'axios';
import { getLanguageCodeForInstitution } from '../pages/registration/description_tab/projects_field/helpers';
import { InstitutionUnitBase, RecursiveInstitutionUnit } from '../types/institution.types';
import { apiRequest } from './apiRequest';

export enum InstitutionApiPaths {
  INSTITUTIONS = '/institution/institutions',
  DEPARTMENTS = '/institution/departments',
}

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
