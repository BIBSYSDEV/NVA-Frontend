import Axios from 'axios';
import { Dispatch as DispatchReact } from 'react';
import { Dispatch } from 'redux';

import { searchAction, SearchActions, searchFailure } from '../redux/actions/searchActions';
import { RESOURCES_API_BASEURL, SEARCH_RESULTS_PER_PAGE } from '../utils/constants';

export const search = (searchTerm: string, dispatchSearch: DispatchReact<SearchActions>, offset?: number) => {
  return async (dispatch: Dispatch) => {
    if (searchTerm.length > 0) {
      Axios.get(`${RESOURCES_API_BASEURL}${searchTerm}`)
        .then(response => {
          const currentOffset = offset || 0;
          const result = response.data.slice(currentOffset, currentOffset + SEARCH_RESULTS_PER_PAGE);
          dispatchSearch(searchAction(result, searchTerm, response.data.length, offset));
        })
        .catch(e => {
          dispatch(searchFailure('ErrorMessage.Search failed'));
        });
    } else {
      // dispatch too few search characters
    }
  };
};
