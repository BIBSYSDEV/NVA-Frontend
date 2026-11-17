import { http, HttpResponse } from 'msw';
import { PublicationChannelApiPath } from '../../../../api/apiPaths';
import { Publisher, SerialPublication } from '../../../../types/registration.types';
import { makeJournal, makePublisher } from '../../factories/publication-channel';
import { makeSearchResponse2 } from '../../factories/search';
import { apiBaseUrl } from '../urls';

/**
 * NOTE: A single channel is fetched with a year as the last path segment, see
 * {@link import('../../../../api/publicationChannelApi').fetchSerialPublication | fetchSerialPublication}. That is why
 * the one with a year comes before the search, which would otherwise answer for it.
 */
export const publicationChannelHandlers = [
  http.get<{ identifier: string; year: string }>(
    `${apiBaseUrl}${PublicationChannelApiPath.SerialPublication}/:identifier/:year`,
    ({ params }) => HttpResponse.json(makeJournal({ identifier: params.identifier }))
  ),
  http.get(`${apiBaseUrl}${PublicationChannelApiPath.SerialPublication}`, () =>
    HttpResponse.json(makeSearchResponse2<SerialPublication>())
  ),
  http.get<{ identifier: string; year: string }>(
    `${apiBaseUrl}${PublicationChannelApiPath.Publisher}/:identifier/:year`,
    ({ params }) => HttpResponse.json(makePublisher({ identifier: params.identifier }))
  ),
  http.get(`${apiBaseUrl}${PublicationChannelApiPath.Publisher}`, () =>
    HttpResponse.json(makeSearchResponse2<Publisher>())
  ),
];
