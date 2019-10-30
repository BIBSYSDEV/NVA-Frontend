import Axios from 'axios';
import { Dispatch } from 'redux';

import { searchFailureAction, searchForResources } from '../actions/resourceActions';
import { RESOURCES_API_BASEURL, SEARCH_RESULTS_PER_PAGE } from '../utils/constants';

export const search = (searchTerm: string, offset?: number) => {
  return async (dispatch: Dispatch) => {
    Axios.get(`${RESOURCES_API_BASEURL}${searchTerm}`)
      .then(response => {
        const currentOffset = offset || 0;
        const result = response.data.slice(currentOffset, currentOffset + SEARCH_RESULTS_PER_PAGE);
        dispatch(searchForResources(result, searchTerm, response.data.length, offset));
      })
      .catch(() => {
        dispatch(searchFailureAction('ErrorMessage.Search failed'));
      });
  };
};
