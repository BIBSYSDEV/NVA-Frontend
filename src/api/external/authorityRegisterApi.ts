import Axios from 'axios';
import { Dispatch } from 'redux';

import { addNotification } from '../../redux/actions/notificationActions';
import i18n from '../../translations/i18n';
import { Authority } from '../../types/authority.types';
import { AUTHORITY_REGISTER_API_URL, StatusCode } from '../../utils/constants';

enum AuthorityTypes {
  PERSON = 'PERSON',
}

// Authority register API docs: https://authority.bibsys.no/authority/

export const getAuthorities = async (
  query: string,
  dispatch: Dispatch,
  start: number = 1,
  max: number = 10,
  type: AuthorityTypes = AuthorityTypes.PERSON
) => {
  const url = `${AUTHORITY_REGISTER_API_URL}/functions/v2/query?q=${query}&start=${start}&max=${max}`;

  try {
    const response = await Axios.get(url);

    if (response.status === StatusCode.OK) {
      const filteredAuthorities = response.data.results.filter(
        (element: { authorityType: AuthorityTypes }) => element.authorityType === type
      );
      return filteredAuthorities;
    } else {
      dispatch(addNotification({ message: i18n.t('feedback:error.get_authorities'), variant: 'error' }));
    }
  } catch {
    dispatch(addNotification({ message: i18n.t('feedback:error.get_authorities'), variant: 'error' }));
  }
};

export const getAuthorityById = async (id: string, dispatch: Dispatch, idType: string = 'feide') => {
  const url = `${AUTHORITY_REGISTER_API_URL}/functions/v2/identifier/${idType}?id=${id}&format=json`;

  try {
    const response = await Axios.get(url);

    if (response.status === StatusCode.OK) {
      // Return authority object or undefined if none
      return response.data[0];
    } else {
      dispatch(addNotification({ message: i18n.t('feedback:error.get_authority'), variant: 'error' }));
    }
  } catch {
    dispatch(addNotification({ message: i18n.t('feedback:error.get_authority'), variant: 'error' }));
  }
};

export const updateAuthority = async (authority: Authority, dispatch: Dispatch) => {
  const url = `${AUTHORITY_REGISTER_API_URL}/authorities/v2/${authority.systemControlNumber}`;

  try {
    const response = await Axios.put(url, authority);

    if (response.status === StatusCode.OK) {
      dispatch(addNotification({ message: i18n.t('feedback:success.update_authority'), variant: 'success' }));
      return response.data;
    } else {
      dispatch(addNotification({ message: i18n.t('feedback:error.update_authority'), variant: 'error' }));
    }
  } catch {
    dispatch(addNotification({ message: i18n.t('feedback:error.update_authority'), variant: 'error' }));
  }
};
