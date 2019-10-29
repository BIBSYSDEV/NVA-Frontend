import Axios from 'axios';
import { Dispatch } from 'redux';

import { RESOURCES_API_BASEURL, SEARCH_RESULTS_PER_PAGE } from '../utils/constants';
import { searchForResources } from '../actions/resourceActions';
import { orcidRequestFailureAction } from '../actions/orcidActions';

export const search = (searchTerm: string, offset?: number) => {
  return async (dispatch: Dispatch) => {
    Axios.get(`${RESOURCES_API_BASEURL}${searchTerm}`)
      .then(response => {
        const currentOffset = offset || 0;
        const result = response.data.slice(currentOffset, currentOffset + SEARCH_RESULTS_PER_PAGE);
        dispatch(searchForResources(result, searchTerm, response.data.length, offset));
      })
      .catch(() => {
        dispatch(orcidRequestFailureAction('Search request failed'));
      });
  };
};
