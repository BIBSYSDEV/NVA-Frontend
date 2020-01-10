import Axios from 'axios';
import { Dispatch } from 'redux';

import { addNotification } from '../../redux/actions/notificationActions';
import i18n from '../../translations/i18n';
import { Authority } from '../../types/authority.types';
import { AUTHORITY_REGISTER_API_URL, StatusCode } from '../../utils/constants';

export const getAuthorities = async (name: string, dispatch: Dispatch) => {
  const url = `${AUTHORITY_REGISTER_API_URL}/authority`;

  try {
    const response = await Axios.post(url, {
      name,
    });

    if (response.status === StatusCode.OK) {
      return response.data;
    } else {
      dispatch(addNotification(i18n.t('feedback:error.get_authorities'), 'error'));
    }
  } catch {
    dispatch(addNotification(i18n.t('feedback:error.get_authorities'), 'error'));
  }
};

export const getAuthorityByFeideId = async (feideId: string, dispatch: Dispatch) => {
  const url = `${AUTHORITY_REGISTER_API_URL}/authority`;

  try {
    const response = await Axios.post(url, {
      feideId,
    });

    if (response.status === StatusCode.OK) {
      const filteredAuthorities = response.data.filter((auth: Authority) => auth.feideId === feideId);
      return filteredAuthorities?.[0] ?? null;
    } else {
      dispatch(addNotification({ message: i18n.t('feedback:error.get_authority'), variant: 'error' }));
    }
  } catch {
    dispatch(addNotification({ message: i18n.t('feedback:error.get_authority'), variant: 'error' }));
  }
};

export const getAuthorityByOrcId = async (orcId: string, dispatch: Dispatch) => {
  const url = `${AUTHORITY_REGISTER_API_URL}/authority`;

  try {
    const response = await Axios.post(url, {
      orcId,
    });

    if (response.status === StatusCode.OK) {
      return response.data;
    } else {
      dispatch(addNotification(i18n.t('feedback:error.get_authority'), 'error'));
    }
  } catch {
    dispatch(addNotification(i18n.t('feedback:error.get_authority'), 'error'));
  }
};

export const updateAuthority = async (authority: Partial<Authority> | null, dispatch: Dispatch) => {
  if (!authority) {
    return;
  }

  const url = `${AUTHORITY_REGISTER_API_URL}/authority/${authority.scn}`;

  try {
    const response = await Axios.put(url, authority);

    if (response.status === StatusCode.OK) {
      dispatch(addNotification(i18n.t('feedback:success.update_authority'), 'success'));
      return response.data;
    } else {
      dispatch(addNotification(i18n.t('feedback:error.update_authority'), 'error'));
    }
  } catch {
    dispatch(addNotification(i18n.t('feedback:error.update_authority'), 'error'));
  }
};
