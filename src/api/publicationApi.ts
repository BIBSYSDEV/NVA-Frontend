import Axios from 'axios';
import { Dispatch } from 'redux';

import i18n from '../translations/i18n';
import { Publication, PublicationFileMap, PublicationMetadata } from '../types/publication.types';
import { ApiBaseUrl, StatusCode, API_URL, API_TOKEN } from '../utils/constants';
import { addNotification } from '../redux/actions/notificationActions';

interface DoiPublication {
  url: string;
  owner: string;
}

export const createNewPublicationFromDoi = (url: string, owner: string) => {
  const data: DoiPublication = {
    url,
    owner,
  };
  return async (dispatch: Dispatch) => {
    try {
      const response = await Axios({
        method: 'POST',
        url: `/${ApiBaseUrl.PUBLICATIONS}/doi`,
        data: data,
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          Accept: 'application/json',
          'Content-Type': 'aplication/json',
        },
      });
      if (response.status === StatusCode.OK) {
        dispatch(addNotification(i18n.t('feedback:success.create_publication')));
      } else {
        dispatch(addNotification(i18n.t('feedback:error.create_publication'), 'error'));
      }
    } catch {
      dispatch(addNotification(i18n.t('feedback:error.create_publication'), 'error'));
    }
  };
};

export const createNewPublication = async (
  files: PublicationFileMap[],
  metadata: PublicationMetadata,
  owner: string,
  dispatch: Dispatch
) => {
  const publication: Partial<Publication> = {
    files,
    metadata,
    owner,
  };
  const url = `${API_URL}/insert-resource`;

  try {
    const response = await Axios.post(url, publication, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        Accept: 'application/json',
        'Content-Type': 'aplication/json',
      },
    });
    if (response.status === StatusCode.OK) {
      dispatch(addNotification(i18n.t('feedback:success.create_publication')));
    } else {
      dispatch(addNotification(i18n.t('feedback:error.create_publication'), 'error'));
    }
  } catch {
    dispatch(addNotification(i18n.t('feedback:error.create_publication'), 'error'));
  }
};

export const updatePublication = async (publication: Publication, dispatch: Dispatch) => {
  const { publicationIdentifier } = publication;
  const url = `${API_URL}/update-resource/${publicationIdentifier}`;

  try {
    const response = await Axios.put(url, publication, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    if (response.status === StatusCode.OK) {
      dispatch(addNotification(i18n.t('feedback:success.update_publication')));
    } else {
      dispatch(addNotification(i18n.t('feedback:error.update_publication'), 'error'));
    }
  } catch {
    dispatch(addNotification(i18n.t('feedback:error.update_publication'), 'error'));
  }
};

export const getPublication = async (id: string, dispatch: Dispatch) => {
  const url = `${API_URL}/fetch-resource/${id}`;
  try {
    const response = await Axios.get(url, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        Accept: 'application/json',
      },
    });
    if (response.status === StatusCode.OK) {
      return response;
    } else {
      dispatch(addNotification(i18n.t('feedback:error.get_publication'), 'error'));
    }
  } catch {
    dispatch(addNotification(i18n.t('feedback:error.get_publication'), 'error'));
  }
};

export const lookupDoiTitle = async (url: string) => {
  try {
    const response = await Axios.get(`/${ApiBaseUrl.DOI_LOOKUP}${url}`);
    if (response.status === StatusCode.OK) {
      return response.data.title;
    } else {
      console.error('error.get_doi'); //TO BE REPLACED
    }
  } catch {
    console.error('error.get_doi'); //TO BE REPLACED
  }
};
