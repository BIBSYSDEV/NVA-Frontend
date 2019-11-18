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

interface createNewResourceFromDOIDataType {
  url: string;
  owner: string;
}
export const createNewResourceFromDOI = (url: string, owner: string) => {
  const data: createNewResourceFromDOIDataType = {
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
        //TODO: use metadata to fill schema
      } else {
        dispatch(createResourceFailure('ErrorMessage.Could not create resource'));
      }
    } catch (err) {
      dispatch(createResourceFailure('ErrorMessage.Could not create resource'));
      console.error(err);
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
        dispatch(createResourceFailure('ErrorMessage.Could not create resource'));
      }
    } catch {
      dispatch(createResourceFailure('ErrorMessage.Could not create resource'));
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
        dispatch(updateResourceFailure('ErrorMessage.Could not update resource'));
      }
    } catch {
      dispatch(updateResourceFailure('ErrorMessage.Could not update resource'));
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
        dispatch(getResourceFailure('ErrorMessage.Could not get resource'));
      }
    } catch {
      dispatch(getResourceFailure('ErrorMessage.Could not get resource'));
    }
  };
};
