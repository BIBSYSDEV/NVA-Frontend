import { emptySearchResults, SearchResult } from '../../types/search.types';
import { CLEAR_SEARCH, SEARCH, SearchActions } from '../actions/searchActions';

export const searchReducer = (state: SearchResult = emptySearchResults, action: SearchActions) => {
  switch (action.type) {
    case SEARCH:
      return {
        resources: [...action.resources],
        searchTerm: action.searchTerm,
        totalNumberOfHits: action.totalNumberOfHits,
        offset: action.offset ? action.offset : 0,
      };
    case CLEAR_SEARCH:
      return { ...state, ...emptySearchResults };
    default:
      return state;
  }
};
