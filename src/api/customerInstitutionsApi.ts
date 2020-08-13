import { CustomerInstitution } from '../types/customerInstitution.types';
import { getIdToken } from './userApi';
import Axios, { CancelToken } from 'axios';
import i18n from '../translations/i18n';
import { StatusCode } from '../utils/constants';
import { authenticatedApiRequest } from './apiRequest';

export enum CustomerInstitutionApiPaths {
  CUSTOMER_INSTITUTION = '/customer',
}

export const getAllCustomerInstitutions = async () => {
  try {
    const idToken = await getIdToken();
    const headers = {
      Authorization: `Bearer ${idToken}`,
    };
    const response = await Axios.get(CustomerInstitutionApiPaths.CUSTOMER_INSTITUTION, {
      headers,
    });
    if (response.status === StatusCode.OK) {
      return response.data;
    } else {
      return {
        error: i18n.t('feedback:error.get_customers'),
      };
    }
  } catch {
    return {
      error: i18n.t('feedback:error.get_customers'),
    };
  }
};

export const getCustomerInstitution = async (identifier: string, cancelToken?: CancelToken) => {
  const response = await authenticatedApiRequest<CustomerInstitution>({
    url: `${CustomerInstitutionApiPaths.CUSTOMER_INSTITUTION}/${identifier}`,
    method: 'GET',
    cancelToken,
  });
  return response;
};

export const createCustomerInstitution = async (customer: CustomerInstitution) => {
  try {
    const idToken = await getIdToken();
    const headers = {
      Authorization: `Bearer ${idToken}`,
    };
    const response = await Axios.post(CustomerInstitutionApiPaths.CUSTOMER_INSTITUTION, customer, { headers });
    if (response.status === StatusCode.CREATED) {
      return response.data;
    } else {
      return {
        error: i18n.t('feedback:error.create_customer'),
      };
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
      `${CustomerInstitutionApiPaths.CUSTOMER_INSTITUTION}/${customer.identifier}`,
      customer,
      { headers }
    );
    if (response.status === StatusCode.OK) {
      return response.data;
    } else {
      return {
        error: i18n.t('feedback:error.update_customer'),
      };
    }
  } catch {
    return {
      error: i18n.t('feedback:error.update_customer'),
    };
  }
};
