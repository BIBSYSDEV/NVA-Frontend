import mockCustomerInstitutions from '../utils/testfiles/mock_customer_institutions.json';
import mockCustomerInstitution from '../utils/testfiles/mock_customer_institution.json';

export enum CustomerInstituionApiPaths {
  CUSTOMER_INSTITUTION = '/customer-institutions',
}

export const getAllCustomerInstitutions = async () => {
  return mockCustomerInstitutions;
};

export const getInstitution = async (id: string) => {
  return mockCustomerInstitution;
};
