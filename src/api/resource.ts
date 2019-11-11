import Axios from 'axios';
import { Dispatch } from 'redux';

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
          // dispatch(createNewResourceSuccess())
        } else {
          // dispatch(createNewResourceFailure())
        }
      })
      .catch(() => {
        // dispatch(createNewResourceFailure())
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
          // dispatch(updateNewResourceSuccess())
        } else {
          // dispatch(updateNewResourceFailure())
        }
      })
      .catch(() => {
        // dispatch(updateNewResourceFailure())
      });
  };
};

export const getResource = (id: string) => {
  return async (dispatch: Dispatch) => {
    Axios.get(`/${RESOURCES_API_BASEURL}${id}`)
      .then(response => {
        if (response.status === 200) {
          // dispatch(getResourceSuccess())
          return response;
        } else {
          // dispatch(getResourceFailure())
        }
      })
      .catch(() => {
        // dispatch(getResourceFailure())
      });
  };
};
