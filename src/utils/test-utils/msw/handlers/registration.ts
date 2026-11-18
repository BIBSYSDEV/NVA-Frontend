import { http, HttpResponse } from 'msw';
import { PublicationsApiPath } from '../../../../api/apiPaths';
import { makeRegistration } from '../../factories/registration';
import { apiBaseUrl } from '../urls';

export const registrationHandlers = [
  http.get<{ identifier: string }>(`${apiBaseUrl}${PublicationsApiPath.Registration}/:identifier`, ({ params }) =>
    HttpResponse.json(makeRegistration({ identifier: params.identifier }))
  ),
];
