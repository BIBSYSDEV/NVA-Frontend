import fetchMock from 'fetch-mock';
import { Dispatch } from 'redux';

import { searchForResources } from '../actions/resourceActions';
import { setUserAction } from '../actions/userActions';
import { Resource } from '../types/resource.types';
import User from '../types/user.types';
import resources from '../utils/testfiles/resources_45_random_results_generated.json';
import user from '../utils/testfiles/user.json';
import { SEARCH_RESULTS_PER_PAGE, useMockData } from '../utils/constants';

export const mockSetUser = async (dispatch: Dispatch) => {
  fetchMock.mock('http://example.com/user', user);
  return await fetch('http://example.com/user')
    .then(data => data.json())
    .then((data: User) => {
      dispatch(setUserAction(data));
    })
    .then(() => {
      fetchMock.reset();
    });
};

export const Search = async (dispatch: Dispatch, searchTerm: string, offset: number) => {
  if (useMockData) {
    fetchMock.mock(`/resources/${searchTerm}`, resources);
  }
  return await fetch(`/resources/${searchTerm}`)
    .then(data => {
      return data.json();
    })
    .then((data: Resource[]) => {
      const result = data.slice(offset, offset + SEARCH_RESULTS_PER_PAGE);
      dispatch(searchForResources(result, searchTerm, data.length, offset));
    })
    .then(() => {
      if (useMockData) {
        fetchMock.reset();
      }
    });
};
