import Axios from 'axios';
import { Institution, InstitutionSubUnit, InstitutionUnit, emptyInstitutionNames } from '../types/institution.types';
import { getIdToken } from './userApi';

export enum InstituionApiPaths {
  INSTITUTION = '/cristin-institutions',
  UNIT = '/cristin-institutions/unit',
}

export const queryInstitution = async (searchTerm: string) => {
  const idToken = await getIdToken();
  const headers = {
    Authorization: `Bearer ${idToken}`,
  };
  const url = `${InstituionApiPaths.INSTITUTION}?name=${searchTerm}`;

  try {
    const response = await Axios.get(url, { headers });
    return response.data;
  } catch {
    return [];
  }
};

export const getInstitutionSubUnit = async (cristinUnitId: string) => {
  const idToken = await getIdToken();
  const headers = {
    Authorization: `Bearer ${idToken}`,
  };
  const url = `${InstituionApiPaths.UNIT}/${cristinUnitId}`;

  try {
    const response = await Axios.get(url, { headers });
    return response.data;
  } catch {
    return [];
  }
};

const findTopInstitutionNames = async (institutionId: string) => {
  try {
    const institutions = await queryInstitution(institutionId);
    const topInstitution = institutions
      .filter((institution: Institution) => institution.cristinUnitId === institutionId)
      .pop();
    return topInstitution.institutionNames;
  } catch {
    return [];
  }
};

const findSubUnitNames = async (institutionId: string, subUnitId: string) => {
  try {
    const faculties = await getInstitutionSubUnit(institutionId);
    const faculty = faculties.filter((faculty: InstitutionSubUnit) => faculty.cristinUnitId === subUnitId).pop();
    return faculty?.unitNames || [];
  } catch {
    return [];
  }
};

export const institutionLookup = async (cristinUnitId: string) => {
  const institutionNumber = cristinUnitId.split('.');

  const presentation: InstitutionUnit = {
    cristinUnitId: cristinUnitId,
    institutionName: emptyInstitutionNames,
    level1Name: emptyInstitutionNames,
    level2Name: emptyInstitutionNames,
  };

  const institutionId = `${institutionNumber[0]}.0.0.0`;
  presentation.institutionName = await findTopInstitutionNames(institutionId);

  const facultyId = `${institutionNumber[0]}.${institutionNumber[1]}.0.0`;
  presentation.level1Name = await findSubUnitNames(institutionId, facultyId);

  const instituteId = `${institutionNumber[0]}.${institutionNumber[1]}.${institutionNumber[2]}.0`;
  presentation.level2Name = await findSubUnitNames(facultyId, instituteId);

  return presentation;
};
