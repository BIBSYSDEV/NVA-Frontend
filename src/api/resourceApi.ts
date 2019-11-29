import Axios from 'axios';
import { Dispatch } from 'redux';

import {
  createResourceFailure,
  createResourceSuccess,
  getResourceFailure,
  getResourceSuccess,
  updateResourceFailure,
  updateResourceSuccess,
} from '../redux/actions/resourceActions';
import i18n from '../translations/i18n';
import { Resource, ResourceFileMap, ResourceMetadata } from '../types/resource.types';
import { ApiBaseUrl, StatusCode } from '../utils/constants';

interface DoiResource {
  url: string;
  owner: string;
}
export const createNewResourceFromDoi = (url: string, owner: string) => {
  const data: DoiResource = {
    url,
    owner,
  };
  return async (dispatch: Dispatch) => {
    try {
      const response = await Axios({
        method: 'POST',
        url: `/${ApiBaseUrl.RESOURCES}/doi`,
        data: data,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'aplication/json',
        },
      });
      if (response.status === StatusCode.OK) {
        dispatch(createResourceSuccess());
      } else {
        dispatch(createResourceFailure(i18n.t('feedback:error.create_resource')));
      }
    } catch {
      dispatch(createResourceFailure(i18n.t('feedback:error.create_resource')));
    }
  };
};

export const createNewResource = (files: ResourceFileMap[], metadata: ResourceMetadata, owner: string) => {
  const resource: Partial<Resource> = {
    files,
    metadata,
    owner,
  };

  return async (dispatch: Dispatch) => {
    try {
      const response = await Axios({
        method: 'POST',
        url: `/${ApiBaseUrl.RESOURCES}`,
        data: resource,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'aplication/json',
        },
      });
      if (response.status === StatusCode.OK) {
        dispatch(createResourceSuccess());
      } else {
        dispatch(createResourceFailure(i18n.t('feedback:error.create_resource')));
      }
    } catch {
      dispatch(createResourceFailure(i18n.t('feedback:error.create_resource')));
    }
  };
};

export const updateResource = (resource: Resource) => {
  const { resourceIdentifier } = resource;
  return async (dispatch: Dispatch) => {
    try {
      const response = await Axios({
        method: 'PUT',
        url: `/${ApiBaseUrl.RESOURCES}/${resourceIdentifier}`,
        data: { ...resource, modifiedDate: new Date().toISOString() },
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      if (response.status === StatusCode.OK) {
        dispatch(updateResourceSuccess());
      } else {
        dispatch(updateResourceFailure(i18n.t('feedback:error.update_resource')));
      }
    } catch {
      dispatch(updateResourceFailure(i18n.t('feedback:error.update_resource')));
    }
  };
};

export const getResource = (id: string) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await Axios.get(`/${ApiBaseUrl.RESOURCES}${id}`);
      if (response.status === StatusCode.OK) {
        dispatch(getResourceSuccess());
        return response;
      } else {
        dispatch(getResourceFailure(i18n.t('feedback:error.get_resource')));
      }
    } catch {
      dispatch(getResourceFailure(i18n.t('feedback:error.get_resource')));
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
