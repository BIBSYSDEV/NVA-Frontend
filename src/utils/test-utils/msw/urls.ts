import { API_URL } from '../../constants';

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
