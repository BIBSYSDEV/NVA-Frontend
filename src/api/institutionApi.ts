import Axios from 'axios';
import { InstitutionUnit } from '../types/institution.types';
import { getIdToken } from './userApi';
import { InstitutionSubUnit } from './../types/institution.types';

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
    return null;
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
    return null;
  }
};

export const getInstitutionUnitNames = async (cristinUnitId: string) => {
  const institutionUnit: InstitutionUnit = {
    cristinUnitId,
    subUnits: [],
  };

  const subUnit: InstitutionSubUnit = await getInstitutionSubUnit(cristinUnitId);

  // find subUnits
  if (!cristinUnitId.endsWith('0.0.0')) {
    institutionUnit.subUnits = [subUnit];

    if (subUnit.parentUnit) {
      let parentSubUnit = await getInstitutionSubUnit(subUnit.parentUnit?.cristinUnitId);
      institutionUnit.subUnits = [parentSubUnit, ...institutionUnit.subUnits];
      while (parentSubUnit.parentUnit) {
        institutionUnit.subUnits = [parentSubUnit, ...institutionUnit.subUnits];
        parentSubUnit = await getInstitutionSubUnit(parentSubUnit.parentUnit.cristinUnitId);
      }
    }
  }

  // find Institution
  const topInstitutionId = subUnit.institution.cristinInstitutionId;
  const institutionId = `${topInstitutionId}.0.0.0`;

  const topInstitution = await getInstitutionSubUnit(institutionId);
  institutionUnit.subUnits = [topInstitution, ...institutionUnit.subUnits];

  return institutionUnit;
};
