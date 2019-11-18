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
import { Resource, ResourceFileMap, ResourceMetadata } from '../types/resource.types';
import { ApiBaseUrl, StatusCode } from '../utils/constants';

interface DoiResource {
  url: string;
  owner: string;
}
export const createNewResourceFromDOI = (url: string, owner: string) => {
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
        dispatch(createResourceFailure('ErrorMessage.Could not create resource'));
      }
    } catch {
      dispatch(createResourceFailure('ErrorMessage.Could not create resource'));
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
        dispatch(createResourceFailure('error.create_resource'));
      }
    } catch {
      dispatch(createResourceFailure('error.create_resource'));
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
        dispatch(updateResourceFailure('error.update_resource'));
      }
    } catch {
      dispatch(updateResourceFailure('error.update_resource'));
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
        dispatch(getResourceFailure('error.get_resource'));
      }
    } catch {
      dispatch(getResourceFailure('error.get_resource'));
    }
  };
};
