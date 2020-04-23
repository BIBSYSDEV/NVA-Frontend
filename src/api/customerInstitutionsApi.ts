import mockCustomerInstitutions from '../utils/testfiles/mock_customer_institutions.json';
import { CustomerInstitution, emptyCustomerInstitution } from '../types/customerInstitution.types';
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

export const getInstitution = async (identifier: string) => {
  try {
    const idToken = await getIdToken();
    const headers = {
      Authorization: `Bearer ${idToken}`,
    };
    const response = await Axios.get(`${CustomerInstituionApiPaths.CUSTOMER_INSTITUTION}/${identifier}`, {
      headers,
    });
    if (response.status === StatusCode.OK) {
      return response.data;
    } else {
      return null;
    }
  } catch {
    return {
      error: i18n.t('feedback:error.get_customer'),
    };
  }
};

export const createCustomerInstitution = async (customer: CustomerInstitution) => {
  try {
    const idToken = await getIdToken();
    const headers = {
      Authorization: `Bearer ${idToken}`,
    };
    const response = await Axios.post(
      CustomerInstituionApiPaths.CUSTOMER_INSTITUTION,
      { ...emptyCustomerInstitution, ...customer },
      { headers }
    );
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

export const updateCustomerInstitution = async (customer: CustomerInstitution) => {
  try {
    const idToken = await getIdToken();
    const headers = {
      Authorization: `Bearer ${idToken}`,
    };
    const response = await Axios.put(
      `${CustomerInstituionApiPaths.CUSTOMER_INSTITUTION}/${customer.identifier}`,
      { ...emptyCustomerInstitution, ...customer },
      { headers }
    );
    if (response.status === StatusCode.OK) {
      return response.data;
    } else {
      return null;
    }
  } catch {
    return {
      error: i18n.t('feedback:error.update_customer'),
    };
  }
};
