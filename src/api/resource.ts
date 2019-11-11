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
import { RESOURCES_API_BASEURL } from '../utils/constants';

export const createNewResource = (files: ResourceFileMap[], metadata: ResourceMetadata) => {
  const owner = 'user@unit.no';

  const resource: Partial<Resource> = {
    createdDate: new Date().toISOString(),
    files,
    metadata,
    owner,
  };

  return async (dispatch: Dispatch) => {
    Axios({
      method: 'POST',
      url: `/${RESOURCES_API_BASEURL}`,
      data: resource,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'aplication/json',
      },
    })
      .then(response => {
        if (response.status === 200) {
          dispatch(createResourceSuccess());
        } else {
          dispatch(createResourceFailure('ErrorMessage.Could not create resource'));
        }
      })
      .catch(() => {
        dispatch(createResourceFailure('ErrorMessage.Could not create resource'));
      });
  };
};

export const updateResource = (resource: Resource) => {
  const { resourceIdentifier } = resource;
  return async (dispatch: Dispatch) => {
    Axios({
      method: 'PUT',
      url: `/${RESOURCES_API_BASEURL}${resourceIdentifier}`,
      data: { ...resource, modifiedDate: new Date().toISOString() },
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (response.status === 200) {
          dispatch(updateResourceSuccess());
        } else {
          dispatch(updateResourceFailure('ErrorMessage.Could not update resource'));
        }
      })
      .catch(() => {
        dispatch(updateResourceFailure('ErrorMessage.Could not update resource'));
      });
  };
};

export const getResource = (id: string) => {
  return async (dispatch: Dispatch) => {
    Axios.get(`/${RESOURCES_API_BASEURL}${id}`)
      .then(response => {
        if (response.status === 200) {
          dispatch(getResourceSuccess());
          return response;
        } else {
          dispatch(getResourceFailure('ErrorMessage.Could not get resource'));
        }
      })
      .catch(() => {
        dispatch(getResourceFailure('ErrorMessage.Could not get resource'));
      });
  };
};
