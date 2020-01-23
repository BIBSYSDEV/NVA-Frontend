import Axios from 'axios';
import { API_URL } from '../utils/constants';
import {
  Institution,
  InstitutionSubUnit,
  emptyInstitution,
  emptyInstitutionSubUnit,
  InstitutionPresentationModel,
  emptyInstitutionName,
} from '../types/institution.types';

export enum InstituionApiPaths {
  QUERY = '/institution',
  GET = '/institution/unit/',
}

export const queryInstitution = async (searchTerm: string) => {
  try {
    const response = await Axios({
      method: 'GET',
      url: `${API_URL}${InstituionApiPaths.QUERY}?name=${searchTerm}`,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    return [];
  }
};

export const getInstitutionSubUnit = async (cristinUnitId: string) => {
  try {
    const response = await Axios({
      method: 'GET',
      url: `${API_URL}${InstituionApiPaths.GET}${cristinUnitId}`,
    });
    return response.data;
  } catch {
    return [];
  }
};

export const institutionLookup = async (cristinUnitId: string) => {
  const idElements = cristinUnitId.split('.');

  const presentation: InstitutionPresentationModel = {
    cristinUnitId: cristinUnitId,
    institutionName: [emptyInstitutionName],
    level1Name: [emptyInstitutionName],
    level2Name: [emptyInstitutionName],
  };

  // query for top-institution
  const institutionId = `${idElements[0]}.0.0.0`;

  var topInstitution: Institution = emptyInstitution;
  await queryInstitution(institutionId).then(institutions => {
    topInstitution = institutions
      .filter((institution: Institution) => institution.cristinUnitId === institutionId)
      .pop();
    presentation.institutionName = topInstitution.institutionNames;
  });

  // find faculty
  const facultyId = `${idElements[0]}.${idElements[1]}.0.0`;
  var faculty = emptyInstitutionSubUnit;
  await getInstitutionSubUnit(institutionId).then(faculties => {
    faculty = faculties.filter((faculty: InstitutionSubUnit) => faculty.cristinUnitId === facultyId).pop();
    presentation.level1Name = faculty?.unitNames || [];
  });

  // find institute
  const instituteId = `${idElements[0]}.${idElements[1]}.${idElements[2]}.0`;
  var institute = emptyInstitutionSubUnit;
  await getInstitutionSubUnit(facultyId).then(institutes => {
    institute = institutes.filter((institute: InstitutionSubUnit) => institute.cristinUnitId === instituteId).pop();

    presentation.level2Name = institute?.unitNames || [];
  });

  return presentation;
};
