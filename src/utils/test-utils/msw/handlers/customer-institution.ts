import { http, HttpResponse } from 'msw';
import { CustomerInstitutionApiPath } from '../../../../api/apiPaths';
import { makeCustomerInstitution } from '../../factories/customer-institution';
import { apiBaseUrl } from '../urls';

export const customerInstitutionHandlers = [
  http.get<{ identifier: string }>(`${apiBaseUrl}${CustomerInstitutionApiPath.Customer}/:identifier`, ({ params }) =>
    HttpResponse.json(makeCustomerInstitution({ identifier: params.identifier }))
  ),
];
