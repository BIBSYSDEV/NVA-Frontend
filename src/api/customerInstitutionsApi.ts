import mockCustomerInstitutions from '../utils/testfiles/mock_customer_institutions.json';

export enum CustomerInstituionApiPaths {
  CUSTOMER_INSTITUTION = '/customer-institutions',
}

export const getAllCustomerInstitutions = async () => {
  return mockCustomerInstitutions;
};
