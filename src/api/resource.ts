import fetchMock from 'fetch-mock';
import { Dispatch } from 'redux';

import { fetchResources } from '../actions/resourceActions';
import { Resource } from '../types/resource.types';
import { useMockData } from '../utils/constants';
import resources from '../utils/testfiles/resources.json';

export const getResources = () => {
  return async (dispatch: Dispatch) => {
    if (useMockData) {
      fetchMock.mock('http://example.com/resources', resources);
      return await fetch('http://example.com/resources')
        .then(data => data.json())
        .then((data: Resource[]) => {
          dispatch(fetchResources(data));
        });
    }
  };
};
