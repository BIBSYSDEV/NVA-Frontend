import { http, HttpResponse } from 'msw';
import { SearchApiPath } from '../../../../api/apiPaths';
import { ImportCandidateSummary } from '../../../../types/importCandidate.types';
import { RegistrationSearchItem } from '../../../../types/registration.types';
import { makeSearchResponse2 } from '../../factories/search';
import { apiBaseUrl } from '../urls';

export const searchHandlers = [
  http.get(`${apiBaseUrl}${SearchApiPath.Registrations}`, () =>
    HttpResponse.json(makeSearchResponse2<RegistrationSearchItem>())
  ),
  http.get(`${apiBaseUrl}${SearchApiPath.CustomerRegistrations}`, () =>
    HttpResponse.json(makeSearchResponse2<RegistrationSearchItem>())
  ),
  http.get(`${apiBaseUrl}${SearchApiPath.MyRegistrations}`, () =>
    HttpResponse.json(makeSearchResponse2<RegistrationSearchItem>())
  ),
  http.get(`${apiBaseUrl}${SearchApiPath.ImportCandidates}`, () =>
    HttpResponse.json(makeSearchResponse2<ImportCandidateSummary>())
  ),
];
