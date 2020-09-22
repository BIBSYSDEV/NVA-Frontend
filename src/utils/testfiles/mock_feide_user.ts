import { FeideUser, RoleName, InstitutionUser } from '../../types/user.types';

export const mockUser: FeideUser = {
  name: 'Test User',
  email: 'testuser@unit.no',
  'custom:cristinId': 'https://api.cristin.no/v2/institutions/20202',
  'custom:orgName': 'unit',
  'custom:applicationRoles': `${RoleName.CREATOR},${RoleName.INSTITUTION_ADMIN},${RoleName.APP_ADMIN}`,
  'custom:commonName': 'Unit',
  'custom:feideId': 'tu@unit.no',
  sub: 'jasdfahkf-341-sdfdsf-12321',
  email_verfied: true,
  'custom:affiliation': '[member, employee, staff]',
  'custom:customerId': 'https://api.dev.nva.aws.unit.no/customer/f54c8aa9-073a-46a1-8f7c-dde66c853934',
  identities: "[{'userId':'91829182'}]",
  family_name: 'User',
  given_name: 'Test',
};

export const mockRoles: InstitutionUser = {
  roles: [
    {
      rolename: RoleName.APP_ADMIN,
    },
    {
      rolename: RoleName.CREATOR,
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
