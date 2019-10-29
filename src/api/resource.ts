import { Dispatch } from 'redux';

import { RESOURCES_API_BASEURL, SEARCH_RESULTS_PER_PAGE, useMockData } from '../utils/constants';
import { mockSearch } from './mock-api';
import Axios from 'axios';
import { searchForResources } from '../actions/resourceActions';

export const search = (searchTerm: string, offset?: number) => {
  return async (dispatch: Dispatch) => {
    // make api call to search endpoint
    if (useMockData) {
      mockSearch(dispatch, searchTerm, offset ? offset : 0);
    } else {
      Axios.get(`${RESOURCES_API_BASEURL}${searchTerm}`)
        .then(response => {
          const notEmptyOffset = offset ? offset : 0;
          const result = response.data.slice(notEmptyOffset, notEmptyOffset + SEARCH_RESULTS_PER_PAGE);
          dispatch(searchForResources(result, searchTerm, response.data.length, offset));
        })
        .catch(function(error) {
          console.error(error);
        })
        .finally(function() {});
    }
  };
};
