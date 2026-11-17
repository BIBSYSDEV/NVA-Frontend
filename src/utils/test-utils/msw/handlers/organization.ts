import { http, HttpResponse } from 'msw';
import { CristinApiPath } from '../../../../api/apiPaths';
import { organizations } from '../fixtures/organizations';
import { apiBaseUrl } from '../urls';

export const organizationHandlers = [
  http.get<{ identifier: string }>(`${apiBaseUrl}${CristinApiPath.Organization}/:identifier`, ({ params }) => {
    const organization = organizations.find(({ id }) => id.split('/').pop() === params.identifier);

    return organization ? HttpResponse.json(organization) : new HttpResponse(null, { status: 404 });
  }),
];
