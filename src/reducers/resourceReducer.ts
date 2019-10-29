import { CLEAR_SEARCH, ResourceActions, SEARCH_FOR_RESOURCES } from '../actions/resourceActions';
import { emptySearchResults, SearchResults } from '../types/search.types';

export const resourceReducer = (state: SearchResults = emptySearchResults, action: ResourceActions) => {
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
