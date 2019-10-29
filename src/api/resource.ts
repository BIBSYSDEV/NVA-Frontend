import { Dispatch } from 'redux';
import mockResources2 from '../utils/testfiles/resources_2_random_results_generated.json';
import MockAdapter from 'axios-mock-adapter';

import { RESOURCES_API_BASEURL, SEARCH_RESULTS_PER_PAGE, useMockData } from '../utils/constants';
import Axios from 'axios';
import { searchForResources } from '../actions/resourceActions';

export const search = (searchTerm: string, offset?: number) => {
  return async (dispatch: Dispatch) => {
    // make api call to search endpoint
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
  };
};
