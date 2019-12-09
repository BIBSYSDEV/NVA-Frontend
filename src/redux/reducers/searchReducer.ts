import { emptySearch, Search } from '../../types/search.types';
import { CLEAR_SEARCH, SEARCH_FOR_PUBLICATIONS, SearchActions } from '../actions/searchActions';

export const searchReducer = (state: Search = emptySearch, action: SearchActions) => {
  switch (action.type) {
    case SEARCH_FOR_PUBLICATIONS:
      return {
        publications: [...action.publications],
        searchTerm: action.searchTerm,
        totalNumberOfHits: action.totalNumberOfHits,
        offset: action.offset ? action.offset : 0,
      };
    case CLEAR_SEARCH:
      return { ...emptySearch };
    default:
      return state;
  }
};
