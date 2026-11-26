import { fetchAuthSession } from 'aws-amplify/auth';
import { beforeEach, vi } from 'vitest';
import { makeAuthSession } from './auth';

/**
 * Signs every browser test in, since the app reads who is signed in through `fetchAuthSession` and nothing answers it
 * here. Left alone it resolves with no tokens, `getAccessToken` sends the page to SignedOut, and the test quietly
 * navigates away from what it meant to look at.
 *
 * NOTE: Only `fetchAuthSession` is replaced. `signInWithRedirect` and `signOut` come from the same module, see
 * {@link import('../../hooks/useAuthentication') | useAuthentication}, and blanking them would break a component that
 * does no more than import the hook.
 */
vi.mock('aws-amplify/auth', async (importOriginal) => ({
  ...(await importOriginal<typeof import('aws-amplify/auth')>()),
  fetchAuthSession: vi.fn(),
}));

// NOTE: This block decides who is signed in: fetchAuthSession answers with whatever makeAuthSession built, and
// vi.mocked is there only to let TypeScript accept mockResolvedValue. It runs before each test so that a test which
// signs in as somebody else cannot decide who the next test is.
beforeEach(() => {
  vi.mocked(fetchAuthSession).mockResolvedValue(makeAuthSession());
});
