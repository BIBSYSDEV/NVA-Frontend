import { FeideUser, InstitutionUser, RoleName } from '../../types/user.types';

export const mockUser: FeideUser = {
  'custom:feideId': 'tu@sikt.no',
  'custom:firstName': 'Test',
  'custom:lastName': 'User',
  'custom:orgFeideDomain': 'sikt.no',
  'custom:cristinId': 'https://api.dev.nva.aws.unit.no/cristin/person/1',
  'custom:customerId': 'https://api.dev.nva.aws.unit.no/customer/a-a-a-a-a',
  'custom:topOrgCristinId': 'https://api.dev.nva.aws.unit.no/cristin/organization/20754.0.0.0',
  'custom:nvaUsername': '1@20754.0.0.0',
  'custom:roles':
    'Creator,Doi-Curator,Support-Curator,Publishing-Curator,Curator-thesis,Curator-thesis-embargo,App-admin,Institution-admin,Editor',
  'custom:accessRights': '',
  'custom:allowedCustomers': 'https://api.dev.nva.aws.unit.no/customer/a-a-a-a-a',
};

export const mockRoles: InstitutionUser = {
  roles: [
    { type: 'Role', rolename: RoleName.AppAdmin },
    { type: 'Role', rolename: RoleName.Creator },
    { type: 'Role', rolename: RoleName.DoiCurator },
    { type: 'Role', rolename: RoleName.PublishingCurator },
    { type: 'Role', rolename: RoleName.SupportCurator },
    { type: 'Role', rolename: RoleName.CuratorThesis },
    { type: 'Role', rolename: RoleName.CuratorThesisEmbargo },
    { type: 'Role', rolename: RoleName.Editor },
    { type: 'Role', rolename: RoleName.InstitutionAdmin },
  ],
  username: 'tu@unit.no',
  institution: 'https://api.dev.nva.aws.unit.no/cristin/organization/20754.0.0.0',
  viewingScope: {
    type: 'ViewingScope',
    includedUnits: ['https://api.dev.nva.aws.unit.no/cristin/organization/20754.0.0.0'],
  },
};
