// Info about Marc 21 Format: https://www.loc.gov/marc/authority/
export enum Marc21Codes {
  HEADING_PERSONAL_NAME = '100',
  PERSONAL_NAME = '400',
}
export enum Marc21Subcodes {
  NAME = 'a',
}

export interface Subfield {
  subcode: string;
  value: string;
}

export interface Marcdata {
  tag: Marc21Codes;
  subfields: Subfield[];
}

export interface Authority {
  systemControlNumber: string;
  marcdata: Marcdata[];
  identifiersMap: object;
}
