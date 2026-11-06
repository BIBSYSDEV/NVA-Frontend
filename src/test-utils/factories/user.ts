import {
  CristinPerson,
  CristinPersonAffiliation,
  Employment,
  emptyEmployment,
  InstitutionUser,
  RoleName,
  User,
  UserRole,
} from '../../types/user.types';

/**
 * Builds a user whose `is*` role flags are consistent with its `roles` and `customerId`, the way the app derives them
 * when a user logs in. Passing a flag explicitly overrides the derived value, which lets a test construct a state the
 * app itself would not produce.
 *
 * NOTE: The derivation mirrors `setUser` in `src/redux/userSlice.ts`, which is the source of truth. Keep the two in
 * sync if the role flags change.
 *
 * @param overrides Fields to override on the default user.
 * @returns A user with coherent roles and role flags.
 */
export const makeUser = (overrides: Partial<User> = {}): User => {
  const roles = overrides.roles ?? [];
  const customerId = overrides.customerId;
  const hasRole = (role: RoleName) => !!customerId && roles.includes(role);

  return {
    familyName: '',
    givenName: '',
    nvaUsername: '',
    allowedCustomers: [],
    currentTerms: '',
    acceptedTerms: '',
    roles,
    isAppAdmin: hasRole(RoleName.AppAdmin),
    isInternalImporter: hasRole(RoleName.InternalImporter),
    isDoiCurator: hasRole(RoleName.DoiCurator),
    isPublishingCurator: hasRole(RoleName.PublishingCurator),
    isSupportCurator: hasRole(RoleName.SupportCurator),
    isThesisCurator: hasRole(RoleName.CuratorThesis),
    isEmbargoThesisCurator: hasRole(RoleName.CuratorThesisEmbargo),
    isInstitutionAdmin: hasRole(RoleName.InstitutionAdmin),
    isCreator: hasRole(RoleName.Creator),
    isEditor: hasRole(RoleName.Editor),
    isNviCurator: hasRole(RoleName.NviCurator),
    ...overrides,
  };
};

export const makeUserRole = (overrides: Partial<UserRole> = {}): UserRole => ({
  type: 'Role',
  rolename: RoleName.Creator,
  ...overrides,
});

export const makeInstitutionUser = (overrides: Partial<InstitutionUser> = {}): InstitutionUser => ({
  institution: '',
  roles: [],
  username: '',
  viewingScope: { type: 'ViewingScope', includedUnits: [] },
  ...overrides,
});

export const makeCristinPerson = (overrides: Partial<CristinPerson> = {}): CristinPerson => ({
  id: '',
  affiliations: [],
  employments: [],
  background: {},
  identifiers: [],
  names: [],
  ...overrides,
});

export const makeEmployment = (overrides: Partial<Employment> = {}): Employment => ({
  ...structuredClone(emptyEmployment),
  ...overrides,
});

export const makeCristinPersonAffiliation = (
  overrides: Partial<CristinPersonAffiliation> = {}
): CristinPersonAffiliation => ({
  active: true,
  organization: '',
  role: {
    labels: { no: 'Ansatt', en: 'Employee' },
  },
  ...overrides,
});
