import { emptySearchResults, SearchResults } from '../../types/search.types';
import { CLEAR_SEARCH, SEARCH_FOR_RESOURCES, SearchActions } from '../actions/searchActions';

export const searchReducer = (state: SearchResults = emptySearchResults, action: SearchActions) => {
  switch (action.type) {
    case SEARCH_FOR_RESOURCES:
      return {
        resources: [...action.resources],
        searchTerm: action.searchTerm,
        totalNumberOfHits: action.totalNumberOfHits,
        offset: action.offset ? action.offset : 0,
      };
    case CLEAR_SEARCH:
      return { ...emptySearchResults };
    default:
      return state;
  }
};
