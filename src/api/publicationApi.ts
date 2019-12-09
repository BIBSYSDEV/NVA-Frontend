import Axios from 'axios';
import { Dispatch } from 'redux';

import {
  createPublicationFailure,
  createPublicationSuccess,
  getPublicationFailure,
  getPublicationSuccess,
  updatePublicationFailure,
  updatePublicationSuccess,
} from '../redux/actions/publicationActions';
import i18n from '../translations/i18n';
import { Publication, PublicationFileMap, PublicationMetadata } from '../types/publication.types';
import { ApiBaseUrl, StatusCode } from '../utils/constants';

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
          Accept: 'application/json',
          'Content-Type': 'aplication/json',
        },
      });
      if (response.status === StatusCode.OK) {
        dispatch(createPublicationSuccess());
      } else {
        dispatch(createPublicationFailure(i18n.t('feedback:error.create_publication')));
      }
    } catch {
      dispatch(createPublicationFailure(i18n.t('feedback:error.create_publication')));
    }
  };
};

export const createNewPublication = (files: PublicationFileMap[], metadata: PublicationMetadata, owner: string) => {
  const publication: Partial<Publication> = {
    files,
    metadata,
    owner,
  };

  return async (dispatch: Dispatch) => {
    try {
      const response = await Axios({
        method: 'POST',
        url: `/${ApiBaseUrl.PUBLICATIONS}`,
        data: publication,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'aplication/json',
        },
      });
      if (response.status === StatusCode.OK) {
        dispatch(createPublicationSuccess());
      } else {
        dispatch(createPublicationFailure(i18n.t('feedback:error.create_publication')));
      }
    } catch {
      dispatch(createPublicationFailure(i18n.t('feedback:error.create_publication')));
    }
  };
};

export const updatePublication = (publication: Publication) => {
  const { publicationIdentifier } = publication;
  return async (dispatch: Dispatch) => {
    try {
      const response = await Axios({
        method: 'PUT',
        url: `/${ApiBaseUrl.PUBLICATIONS}/${publicationIdentifier}`,
        data: { ...publication, modifiedDate: new Date().toISOString() },
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      if (response.status === StatusCode.OK) {
        dispatch(updatePublicationSuccess());
      } else {
        dispatch(updatePublicationFailure(i18n.t('feedback:error.update_publication')));
      }
    } catch {
      dispatch(updatePublicationFailure(i18n.t('feedback:error.update_publication')));
    }
  };
};

export const getPublication = (id: string) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await Axios.get(`/${ApiBaseUrl.PUBLICATIONS}${id}`);
      if (response.status === StatusCode.OK) {
        dispatch(getPublicationSuccess());
        return response;
      } else {
        dispatch(getPublicationFailure(i18n.t('feedback:error.get_publication')));
      }
    } catch {
      dispatch(getPublicationFailure(i18n.t('feedback:error.get_publication')));
    }
  };
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
