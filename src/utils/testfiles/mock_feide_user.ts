import { ApplicationName, FeideUser, RoleName } from '../../types/user.types';
import { UserRoles } from '../../types/role.types';

export const mockUser: FeideUser = {
  name: 'Test User',
  email: 'testuser@unit.no',
  'custom:identifiers': 'tu@unit.no',
  'custom:orgName': 'unit',
  'custom:applicationRoles': `${RoleName.PUBLISHER},${RoleName.INSTITUTION_ADMIN},${RoleName.APP_ADMIN}`,
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

export const mockRoles: UserRoles = {
  roles: [
    {
      rolename: RoleName.APP_ADMIN,
    },
    {
      rolename: RoleName.PUBLISHER,
    },
    {
      rolename: RoleName.CURATOR,
    },
    {
      rolename: RoleName.INSTITUTION_ADMIN,
    },
  ],
  username: 'tu@unit.no',
  institution: 'https://api.cristin.no/v2/institutions/20202',
};
