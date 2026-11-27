import { vi, beforeEach } from 'vitest';
import { signIn } from './auth';

/**
 * Signs every browser test in, since the app reads who is signed in through `fetchAuthSession` and nothing answers it
 * here. Left alone it resolves with no tokens and the app runs as a visitor nobody signed in — a state a test can ask
 * for on purpose with `renderApp({ user: null })`, but a poor one to end up in by accident.
 *
 * NOTE: Only `fetchAuthSession` is replaced. The module's own `signInWithRedirect` and `signOut` are left real, since
 * {@link import('../../hooks/useAuthentication') | useAuthentication} imports them, and blanking them would break a
 * component that does no more than import the hook.
 */
vi.mock('aws-amplify/auth', async (importOriginal) => ({
  ...(await importOriginal<typeof import('aws-amplify/auth')>()),
  fetchAuthSession: vi.fn(),
}));

// NOTE: This runs before each test so that a test which signs in as somebody else cannot decide who the next test is.
beforeEach(() => {
  signIn();
});
