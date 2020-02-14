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
  institution: {
    cristinInstitutionId: string;
  };
  subunits?: InstitutionSubUnitChild[];
  subunitSiblings?: InstitutionSubUnitChild[];
  parentUnit?: {
    cristinUnitId: string;
    parentUnitNames: InstitutionName[];
  };
}

export const emptyInstitutionSubUnit: InstitutionSubUnit = {
  unitNames: emptyInstitutionNames,
  cristinUnitId: '',
  institution: {
    cristinInstitutionId: '',
  },
  subunits: [],
};

export interface InstitutionSubUnitChild {
  cristinUnitId: string;
  subunitNames: InstitutionName[];
}

export const emptyInstitutionSubUnitChild = {
  cristinUnitId: '',
  subunitNames: emptyInstitutionNames,
};

export interface InstitutionUnit {
  cristinUnitId: string;
  subUnits: InstitutionSubUnit[];
}

export const emptyInstitutionUnit: InstitutionUnit = {
  cristinUnitId: '',
  subUnits: [],
};
