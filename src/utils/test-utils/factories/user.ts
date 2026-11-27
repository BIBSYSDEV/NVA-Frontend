import userReducer, { setUser } from '../../../redux/userSlice';
import {
  CristinPerson,
  CristinPersonAffiliation,
  CustomUserAttributes,
  Employment,
  emptyEmployment,
  InstitutionUser,
  RoleName,
  User,
  UserRole,
} from '../../../types/user.types';

/**
 * Builds the custom claims a Cognito token carries. This is where the app learns who is signed in: `getCustomUserAttributes`
 * in `src/api/authApi.ts` picks these out of the token, and `setUser` turns them into the `user` state.
 *
 * @param overrides Claims to override on the default, which describes nobody in particular.
 * @returns The custom claims of a token.
 */
export const makeUserAttributes = (overrides: Partial<CustomUserAttributes> = {}): CustomUserAttributes => ({
  'custom:firstName': '',
  'custom:lastName': '',
  'custom:cristinId': '',
  'custom:customerId': '',
  'custom:topOrgCristinId': '',
  'custom:nvaUsername': '',
  'custom:roles': '',
  'custom:allowedCustomers': '',
  'custom:currentTerms': '',
  'custom:acceptedTerms': '',
  ...overrides,
});

/**
 * Derives the `user` state from a token's claims by running the app's own reducer, so that the role flags are the ones
 * the app would have produced for that token.
 *
 * @param attributes The custom claims of a token.
 * @returns The `user` state the app would hold for that token.
 */
export const makeUserState = (attributes: CustomUserAttributes = makeUserAttributes()): User =>
  userReducer(undefined, setUser(attributes)) as User;

/**
 * Builds a user whose `is*` role flags are consistent with its `roles` and `customerId`, the way the app derives them
 * when a user logs in. Passing a flag explicitly overrides the derived value, which lets a test construct a state the
 * app itself would not produce.
 *
 * @param overrides Fields to override on the default user.
 * @returns A user with coherent roles and role flags.
 */
export const makeUser = (overrides: Partial<User> = {}): User => {
  const roles = overrides.roles ?? [];
  const attributes = makeUserAttributes({
    'custom:roles': roles.join(','),
    'custom:customerId': overrides.customerId,
  });

  // NOTE: The reducer reads the roles off a comma separated claim, so an empty one leaves it holding [''] rather than
  // an empty list. That is what the app itself does, but it makes a poor default for a user who simply has no roles.
  return { ...makeUserState(attributes), roles, ...overrides };
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
