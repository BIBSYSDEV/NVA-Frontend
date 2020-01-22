import { EnumDictionary } from '../types/common.types';

export enum CustomerOrganizationId {
  UNIT = '20202.0.0.0',
  STATPED = '5831.0.0.0', // Statped
  NORDEMENS = '7581.0.0.0', // Nasjonalt kompetansesenter for aldring og helse
  FIH = '258.0.0.0', // Fjellhaug internasjonale skole
  ANNOM = '20355.0.0.0', // Anno museum
  NORSOK = '7585.0.0.0', // Norsk senter for økologisk landbruk
}

// These values are composed by NO + organization number
// might change or be replaced by backend
export const customerKeyMap: EnumDictionary<string, string> = {
  NO919477822: CustomerOrganizationId.UNIT,
  NO998554640: CustomerOrganizationId.STATPED,
  NO983975259: CustomerOrganizationId.NORDEMENS,
  NO914086434: CustomerOrganizationId.FIH,
  NO994960822: CustomerOrganizationId.ANNOM,
  NO969840383: CustomerOrganizationId.NORSOK,
};

export const getOrganizationIdByOrganizationNumber = (organizationNumber: string): string => {
  return customerKeyMap[organizationNumber];
};
