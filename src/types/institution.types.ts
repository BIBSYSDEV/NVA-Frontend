export interface InstitutionName {
  name: string;
  language: string;
}

export const emptyInstitutionNames: InstitutionName[] = [
  {
    name: '',
    language: '',
  },
];

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
  institutionNames: emptyInstitutionNames,
  acronym: '',
  cristinInstitutionId: '',
  country: '',
  cristinUnitId: '',
};

export interface InstitutionSubUnit {
  unitNames: InstitutionName[];
  cristinUnitId: string;
  subUnits?: InstitutionSubUnit[];
}

export const emptyInstitutionSubUnit: InstitutionSubUnit = {
  unitNames: emptyInstitutionNames,
  cristinUnitId: '',
  subUnits: [],
};

export interface InstitutionUnit {
  cristinUnitId: string;
  institutionName: InstitutionName[];
  level1Name?: InstitutionName[];
  level2Name?: InstitutionName[];
}

export const emptyInstitutionUnit: InstitutionUnit = {
  cristinUnitId: '',
  institutionName: emptyInstitutionNames,
  level1Name: emptyInstitutionNames,
  level2Name: emptyInstitutionNames,
};
