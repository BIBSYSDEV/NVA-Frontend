import { http, HttpResponse } from 'msw';
import { organizationBaseUrl, organizations } from '../fixtures/organizations';

export const organizationHandlers = [
  http.get<{ identifier: string }>(`${organizationBaseUrl}/:identifier`, ({ params }) => {
    const organization = organizations.find(({ id }) => id === `${organizationBaseUrl}/${params.identifier}`);

    return organization ? HttpResponse.json(organization) : new HttpResponse(null, { status: 404 });
  }),
];
