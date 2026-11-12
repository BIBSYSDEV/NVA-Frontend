import { http, HttpResponse, RequestHandler } from 'msw';
import {
  CristinApiPath,
  CustomerInstitutionApiPath,
  PublicationChannelApiPath,
  PublicationsApiPath,
  RoleApiPath,
  SearchApiPath,
} from '../../../api/apiPaths';
import { ImportCandidateSummary } from '../../../types/importCandidate.types';
import { Publisher, RegistrationSearchItem, SerialPublication } from '../../../types/registration.types';
import { makeCustomerInstitution } from '../factories/customer-institution';
import { makeOrganization } from '../factories/organization';
import { makeJournal, makePublisher } from '../factories/publication-channel';
import { makeRegistration } from '../factories/registration';
import { makeSearchResponse2 } from '../factories/search';
import { makeInstitutionUser } from '../factories/user';

/**
 * The endpoints the app calls, each answering the way the real API does on the happy path. Read together they are meant
 * to describe the shape of the backend, not to satisfy any one test.
 *
 * A handler here answers what the request itself implies, such as the identifier that was asked for. When a test needs
 * a particular response, it declares one with its own `server.use(...)`, which puts its handler in front of the general
 * ones defined here.
 *
 * NOTE: MSW answers with the first handler that matches, so a specific path belongs before the general one it would
 * otherwise be swallowed by.
 */

const apiBaseUrl = 'https://api.sikt.no';
const organizationBaseUrl = `${apiBaseUrl}${CristinApiPath.Organization}`;

/**
 * NOTE: The parent is stated, not derived from the identifier. Cristin identifiers usually encode the hierarchy, but
 * there are exceptions, and `partOf` is a list, so an organization can have parents the identifier cannot express.
 * {@link import('../../institutions-helpers').getTopLevelOrganization | getTopLevelOrganization} walks `partOf` for
 * that very reason.
 */
export const institutionA = makeOrganization({
  id: `${organizationBaseUrl}/1.0.0.0`,
  labels: { en: 'Institution A', nb: 'Institusjon A' },
});

export const institutionAUnit = makeOrganization({
  id: `${organizationBaseUrl}/1.1.0.0`,
  labels: { en: 'Unit at institution A', nb: 'Enhet ved institusjon A' },
  partOf: [institutionA],
});

export const institutionB = makeOrganization({
  id: `${organizationBaseUrl}/2.0.0.0`,
  labels: { en: 'Institution B', nb: 'Institusjon B' },
});

const organizations = [institutionA, institutionAUnit, institutionB];

const organizationHandlers = [
  http.get<{ identifier: string }>(`*${CristinApiPath.Organization}/:identifier`, ({ params }) => {
    const organization = organizations.find(({ id }) => id.split('/').pop() === params.identifier);

    return organization ? HttpResponse.json(organization) : new HttpResponse(null, { status: 404 });
  }),
];

const registrationHandlers = [
  http.get<{ identifier: string }>(`*${PublicationsApiPath.Registration}/:identifier`, ({ params }) =>
    HttpResponse.json(makeRegistration({ identifier: params.identifier }))
  ),
];

const searchHandlers = [
  http.get(`*${SearchApiPath.Registrations}`, () => HttpResponse.json(makeSearchResponse2<RegistrationSearchItem>())),
  http.get(`*${SearchApiPath.CustomerRegistrations}`, () =>
    HttpResponse.json(makeSearchResponse2<RegistrationSearchItem>())
  ),
  http.get(`*${SearchApiPath.MyRegistrations}`, () => HttpResponse.json(makeSearchResponse2<RegistrationSearchItem>())),
  http.get(`*${SearchApiPath.ImportCandidates}`, () =>
    HttpResponse.json(makeSearchResponse2<ImportCandidateSummary>())
  ),
];

const userHandlers = [
  http.get<{ username: string }>(`*${RoleApiPath.Users}/:username`, ({ params }) =>
    HttpResponse.json(makeInstitutionUser({ username: params.username }))
  ),
];

const customerInstitutionHandlers = [
  http.get<{ identifier: string }>(`*${CustomerInstitutionApiPath.Customer}/:identifier`, ({ params }) =>
    HttpResponse.json(makeCustomerInstitution({ identifier: params.identifier }))
  ),
];

/**
 * NOTE: A single channel is fetched with a year as the last path segment, see
 * {@link import('../../../api/publicationChannelApi').fetchSerialPublication | fetchSerialPublication}.
 */
const publicationChannelHandlers = [
  http.get<{ identifier: string; year: string }>(
    `*${PublicationChannelApiPath.SerialPublication}/:identifier/:year`,
    ({ params }) => HttpResponse.json(makeJournal({ identifier: params.identifier }))
  ),
  http.get(`*${PublicationChannelApiPath.SerialPublication}`, () =>
    HttpResponse.json(makeSearchResponse2<SerialPublication>())
  ),
  http.get<{ identifier: string; year: string }>(
    `*${PublicationChannelApiPath.Publisher}/:identifier/:year`,
    ({ params }) => HttpResponse.json(makePublisher({ identifier: params.identifier }))
  ),
  http.get(`*${PublicationChannelApiPath.Publisher}`, () => HttpResponse.json(makeSearchResponse2<Publisher>())),
];

export const handlers: RequestHandler[] = [
  ...organizationHandlers,
  ...registrationHandlers,
  ...searchHandlers,
  ...userHandlers,
  ...customerInstitutionHandlers,
  ...publicationChannelHandlers,
];
