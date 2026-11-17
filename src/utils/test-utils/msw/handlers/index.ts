import { RequestHandler } from 'msw';
import { customerInstitutionHandlers } from './customer-institution';
import { organizationHandlers } from './organization';
import { publicationChannelHandlers } from './publication-channel';
import { registrationHandlers } from './registration';
import { searchHandlers } from './search';
import { userHandlers } from './user';

/**
 * The endpoints the app calls, each answering the way the real API does on the happy path. Read together they are meant
 * to describe the shape of the backend, not to satisfy any one test. When a test needs a
 * particular response, it declares one with its own `server.use(...)`, which puts its handler in front of these.
 *
 * NOTE: MSW answers with the first handler that matches, so a specific path belongs before the general one that would
 * otherwise swallow it. Anchoring every pattern to `apiBaseUrl` keeps a path from matching across domains, but a
 * literal segment can still be taken for a parameter within one: `/customer/channel-claims` matches the handler for
 * `/customer/:identifier`, and would have to come before it.
 */
export const handlers: RequestHandler[] = [
  ...organizationHandlers,
  ...registrationHandlers,
  ...searchHandlers,
  ...userHandlers,
  ...customerInstitutionHandlers,
  ...publicationChannelHandlers,
];
