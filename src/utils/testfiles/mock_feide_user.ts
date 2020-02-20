import { ApplicationName, FeideUser, RoleName } from '../../types/user.types';

export const mockUser: FeideUser = {
  name: 'Test User',
  email: 'testuser@unit.no',
  'custom:identifiers': 'tu@unit.no',
  'custom:orgName': 'unit',
  'custom:applicationRoles': `${RoleName.PUBLISHER},${RoleName.CURATOR}`,
  'custom:application': ApplicationName.NVA,
  'custom:orgNumber': 'NO919477822',
  'custom:commonName': 'Unit',
  'custom:feideId': 'tu@unit.no',
  sub: 'jasdfahkf-341-sdfdsf-12321',
  email_verfied: true,
  'custom:affiliation': '[member, employee, staff]',
  identities: "[{'userId':'91829182'}]",
  family_name: 'User',
  given_name: 'Test',
};
