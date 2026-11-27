import { AuthSession, fetchAuthSession } from 'aws-amplify/auth';
import { vi } from 'vitest';
import { CristinApiPath, CustomerInstitutionApiPath } from '../../../api/apiPaths';
import { CustomUserAttributes, RoleName } from '../../../types/user.types';
import { institutionA } from '../msw/fixtures/organizations';
import { apiBaseUrl } from '../msw/urls';

const customerId = `${apiBaseUrl}${CustomerInstitutionApiPath.Customer}/1234`;
const termsUri = 'https://sikt.no/terms/2024-01-01';

/**
 * The user a test is signed in as unless it says otherwise: an ordinary Creator at institution A.
 *
 * NOTE: Some of these claims are here to keep a dialog off the page rather than to describe the user. `App` opens
 * `CreateCristinPersonDialog` for a signed in user without a `cristinId`, `AcceptTermsDialog` when the two terms claims
 * differ, and `SelectCustomerInstitutionDialog` when a user who may belong to several customers has not settled on one.
 * Any of them would cover the page the test came to look at.
 */
export const defaultUserAttributes: CustomUserAttributes = {
  'custom:firstName': 'Test',
  'custom:lastName': 'Testesen',
  'custom:cristinId': `${apiBaseUrl}${CristinApiPath.Person}/1234`,
  'custom:customerId': customerId,
  'custom:allowedCustomers': customerId,
  'custom:topOrgCristinId': institutionA.id,
  'custom:nvaUsername': 'test-user@1234',
  'custom:roles': RoleName.Creator,
  'custom:currentTerms': termsUri,
  'custom:acceptedTerms': termsUri,
};

/**
 * Builds the session `fetchAuthSession` answers with, shaped the way {@link import('../../../api/authApi') | authApi}
 * reads it: `getCustomUserAttributes` picks the `custom:` claims off both token payloads, and `getAccessToken` puts the
 * access token in the Authorization header.
 *
 * NOTE: The cast is deliberate. A real `JWT` carries far more than the two things the app reads, and building a whole
 * one would claim the tests depend on parts of it that they do not.
 *
 * @param attributes The claims the token carries.
 * @returns A session holding a token with those claims.
 */
const makeAuthSession = (attributes: CustomUserAttributes) =>
  ({
    tokens: {
      idToken: { payload: attributes },
      accessToken: { payload: attributes, toString: () => 'test-access-token' },
    },
  }) as unknown as AuthSession;

/**
 * What the real `fetchAuthSession` answers when nobody has signed in. It resolves like this rather than failing, which
 * is why a signed out app finds no user instead of an error.
 */
const signedOutSession = { tokens: undefined } as AuthSession;

/**
 * Signs the app in, as the default user unless the test names somebody else. Call it before rendering, since the app
 * asks who is signed in once while it starts.
 *
 * @param attributes The claims of the user to be.
 */
export const signIn = (attributes: CustomUserAttributes = defaultUserAttributes) => {
  vi.mocked(fetchAuthSession).mockResolvedValue(makeAuthSession(attributes));
};

/** Leaves the app with nobody signed in, the way it finds a visitor. */
export const signOut = () => {
  vi.mocked(fetchAuthSession).mockResolvedValue(signedOutSession);
};

/**
 * The default user carrying another set of roles, for a test about what a particular role may do.
 *
 * @param roles The roles the user holds.
 * @returns The claims of a user with those roles.
 */
export const userWithRoles = (...roles: RoleName[]): CustomUserAttributes => ({
  ...defaultUserAttributes,
  'custom:roles': roles.join(','),
});
