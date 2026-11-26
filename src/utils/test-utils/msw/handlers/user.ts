import { http, HttpResponse } from 'msw';
import { RoleApiPath } from '../../../../api/apiPaths';
import { makeInstitutionUser } from '../../factories/user';
import { apiBaseUrl } from '../urls';

export const userHandlers = [
  http.get<{ username: string }>(`${apiBaseUrl}${RoleApiPath.Users}/:username`, ({ params }) =>
    HttpResponse.json(makeInstitutionUser({ username: params.username }))
  ),
];
