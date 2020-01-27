import Axios from 'axios';
import { API_URL } from '../utils/constants';
import {
  Institution,
  InstitutionSubUnit,
  InstitutionPresentationModel,
  emptyInstitutionNames,
} from '../types/institution.types';

export enum InstituionApiPaths {
  INSTITUTION = '/institution',
  UNIT = '/institution/unit/',
}

export const queryInstitution = async (searchTerm: string) => {
  try {
    const response = await Axios({
      method: 'GET',
      url: `${API_URL}${InstituionApiPaths.INSTITUTION}?name=${searchTerm}`,
    });
    return response.data;
  } catch (e) {
    return [];
  }
};

export const getInstitutionSubUnit = async (cristinUnitId: string) => {
  try {
    const response = await Axios({
      method: 'GET',
      url: `${API_URL}${InstituionApiPaths.UNIT}${cristinUnitId}`,
    });
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
  } catch (e) {
    return [];
  }
};

const findSubUnitNames = async (institutionId: string, subUnitId: string) => {
  try {
    const faculties = await getInstitutionSubUnit(institutionId);
    const faculty = faculties.filter((faculty: InstitutionSubUnit) => faculty.cristinUnitId === subUnitId).pop();
    return faculty?.unitNames || [];
  } catch (e) {
    return [];
  }
};

export const institutionLookup = async (cristinUnitId: string) => {
  const institutionNumber = cristinUnitId.split('.');

  const presentation: InstitutionPresentationModel = {
    cristinUnitId: cristinUnitId,
    institutionName: emptyInstitutionNames,
    level1Name: emptyInstitutionNames,
    level2Name: emptyInstitutionNames,
  };

  // query for top-institution
  const institutionId = `${institutionNumber[0]}.0.0.0`;
  presentation.institutionName = await findTopInstitutionNames(institutionId);

  // find faculty
  const facultyId = `${institutionNumber[0]}.${institutionNumber[1]}.0.0`;
  presentation.level1Name = await findSubUnitNames(institutionId, facultyId);

  // find institute
  const instituteId = `${institutionNumber[0]}.${institutionNumber[1]}.${institutionNumber[2]}.0`;
  presentation.level2Name = await findSubUnitNames(facultyId, instituteId);

  return presentation;
};

export const addInstitution = async (cristinUnitId: string) => {};
