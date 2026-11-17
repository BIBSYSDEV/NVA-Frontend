import { API_URL } from '../../constants';

// NOTE: Without this the handler patterns would be anchored to an empty string, which turns them into relative paths
// that quietly match the wrong things rather than failing. Stopping here names the one thing that is actually missing.
if (!API_URL) {
  throw new Error('VITE_API_HOST is not set, so the msw handlers have no host to answer for');
}

/**
 * The host the handlers answer for, which is the one the app calls: `VITE_API_HOST` in `.env.test` feeds `API_URL`
 *
 * NOTE: `API_URL` ends with a slash, since it is built with `new URL(...)`. The paths in `apiPaths.ts` start with one,
 * so the trailing slash has to go or every pattern would carry a double one.
 */
export const apiBaseUrl = API_URL.replace(/\/$/, '');

/**
 * A url no handler covers, and none should: it is what the tests of the unhandled request policy ask for. Keeping it
 * here, rather than as a literal in each test, says that it is meant to stay unanswered.
 */
export const unhandledUrl = 'https://sikt.no/not-handled';
