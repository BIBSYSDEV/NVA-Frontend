import { FeideUser, InstitutionUser, RoleName } from '../../types/user.types';

export const mockUser: FeideUser = {
  'custom:feideId': 'tu@sikt.no',
  'custom:firstName': 'Test',
  'custom:lastName': 'User',
  'custom:orgFeideDomain': 'sikt.no',
  'custom:cristinId': 'https://api.dev.nva.aws.unit.no/cristin/organization/20754.0.0.0',
  'custom:customerId': 'https://api.dev.nva.aws.unit.no/customer/a-a-a-a-a',
  'custom:topOrgCristinId': 'https://api.dev.nva.aws.unit.no/cristin/organization/20754.0.0.0',
  'custom:nvaUsername': '1@20754.0.0.0',
  'custom:roles': '',
  'custom:accessRights': '',
  'custom:allowedCustomers': 'https://api.dev.nva.aws.unit.no/customer/a-a-a-a-a',
};

export const mockRoles: InstitutionUser = {
  roles: [
    { type: 'Role', rolename: RoleName.APP_ADMIN },
    { type: 'Role', rolename: RoleName.CREATOR },
    { type: 'Role', rolename: RoleName.CURATOR },
    { type: 'Role', rolename: RoleName.INSTITUTION_ADMIN },
  ],
  username: 'tu@unit.no',
  institution: 'https://api.dev.nva.aws.unit.no/cristin/organization/20754.0.0.0',
};
