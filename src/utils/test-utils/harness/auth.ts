import { AuthSession } from 'aws-amplify/auth';
import { CristinApiPath, CustomerInstitutionApiPath } from '../../../api/apiPaths';
import { CustomUserAttributes, RoleName } from '../../../types/user.types';
import { makeUserAttributes } from '../factories/user';
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
export const defaultUserAttributes = makeUserAttributes({
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
});

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
export const makeAuthSession = (attributes: CustomUserAttributes = defaultUserAttributes) =>
  ({
    tokens: {
      idToken: { payload: attributes },
      accessToken: { payload: attributes, toString: () => 'test-access-token' },
    },
  }) as unknown as AuthSession;
