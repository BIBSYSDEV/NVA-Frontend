import mockCustomerInstitutions from '../utils/testfiles/mock_customer_institutions.json';
import mockCustomerInstitution from '../utils/testfiles/mock_customer_institution.json';
import { CustomerInstitution } from '../types/customerInstitution.types';
import { getIdToken } from './userApi';
import Axios from 'axios';
import i18n from '../translations/i18n';
import { StatusCode } from '../utils/constants';

export enum CustomerInstituionApiPaths {
  CUSTOMER_INSTITUTION = '/customer',
}

export const getAllCustomerInstitutions = async () => {
  // TODO: get all  publications
  return mockCustomerInstitutions;
};

export const getInstitution = async (id: string) => {
  // TODO: get publication
  return mockCustomerInstitution;
};

export const createCustomerInstitution = async (customer: CustomerInstitution) => {
  try {
    const idToken = await getIdToken();
    const headers = {
      Authorization: `Bearer ${idToken}`,
    };
    const response = await Axios.post(CustomerInstituionApiPaths.CUSTOMER_INSTITUTION, customer, { headers });
    if (response.status === StatusCode.CREATED) {
      return response.data;
    } else {
      return null;
    }
  } catch {
    return {
      error: i18n.t('feedback:error.create_customer'),
    };
  }
};
