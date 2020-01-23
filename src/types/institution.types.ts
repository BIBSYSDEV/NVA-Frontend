export interface InstitutionName {
  name: string;
  language: string;
}

export const emptyInstitutionName: InstitutionName = {
  name: '',
  language: '',
};

export interface Institution {
  title?: string;
  institutionNames: InstitutionName[];
  acronym: string;
  cristinInstitutionId: string;
  country: string;
  cristinUnitId: string;
}

export const emptyInstitution: Institution = {
  title: '',
  institutionNames: [emptyInstitutionName],
  acronym: '',
  cristinInstitutionId: '',
  country: '',
  cristinUnitId: '',
};

export interface InstitutionSubUnit {
  unitNames: InstitutionName[];
  cristinUnitId: string;
}

export const emptyInstitutionSubUnit: InstitutionSubUnit = {
  unitNames: [emptyInstitutionName],
  cristinUnitId: '',
};

export interface InstitutionPresentationModel {
  cristinUnitId: string;
  institutionName: InstitutionName[];
  level1Name?: InstitutionName[];
  level2Name?: InstitutionName[];
}

export const emptyInstitutionPresentation: InstitutionPresentationModel = {
  cristinUnitId: '',
  institutionName: [emptyInstitutionName],
  level1Name: [emptyInstitutionName],
  level2Name: [emptyInstitutionName],
};
