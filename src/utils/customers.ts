import { EnumDictionary } from '../types/common.types';

// TODO: This data will be retrieved from backend soon
// Cannot use computed values (constants) in enums
enum CustomerOrganizationId {
  UNIT = 'https://api.cristin.no/v2/units/20202.0.0.0',
  STATPED = 'https://api.cristin.no/v2/units/5831.0.0.0', // Statped
  NORDEMENS = 'https://api.cristin.no/v2/units/7581.0.0.0', // Nasjonalt kompetansesenter for aldring og helse
  FIH = 'https://api.cristin.no/v2/units/258.0.0.0', // Fjellhaug internasjonale skole
  ANNOM = 'https://api.cristin.no/v2/units/20355.0.0.0', // Anno museum
  NORSOK = 'https://api.cristin.no/v2/units/7585.0.0.0', // Norsk senter for økologisk landbruk
}

// These values are composed by NO + organization number
// might change or be replaced by backend
const customerKeyMap: EnumDictionary<string, string> = {
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
