import { RequestHandler } from 'msw';
import { customerInstitutionHandlers } from './customer-institution';
import { fundingSourceHandlers } from './funding-source';
import { organizationHandlers } from './organization';
import { publicationChannelHandlers } from './publication-channel';
import { registrationHandlers } from './registration';
import { searchHandlers } from './search';
import { userHandlers } from './user';

/**
 * The endpoints the app calls, answering the way the real API does on the happy path. A test that needs a particular
 * response declares it with `server.use(...)`, which goes in front of these.
 *
 * A handler makes an answer that fits the request. Objects that have to be constructed a certain way because they refer
 * to each other live in `fixtures/` instead, where an identifier the list does not hold gives 404.
 *
 * NOTE: MSW answers with the first match, and a literal segment can be taken for a parameter, so
 * `/customer/channel-claims` would be swallowed by `/customer/:identifier` unless it came first.
 */
export const handlers: RequestHandler[] = [
  ...organizationHandlers,
  ...registrationHandlers,
  ...searchHandlers,
  ...userHandlers,
  ...customerInstitutionHandlers,
  ...publicationChannelHandlers,
  ...fundingSourceHandlers,
];
