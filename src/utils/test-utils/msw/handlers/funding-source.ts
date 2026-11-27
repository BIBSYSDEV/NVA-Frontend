import { http, HttpResponse } from 'msw';
import { CristinApiPath } from '../../../../api/apiPaths';
import { makeFundingSources } from '../../factories/funding-source';
import { apiBaseUrl } from '../urls';

export const fundingSourceHandlers = [
  http.get(`${apiBaseUrl}${CristinApiPath.FundingSources}`, () => HttpResponse.json(makeFundingSources())),
];
