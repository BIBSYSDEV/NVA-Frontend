import { Dispatch } from 'redux';

import { useMockData } from '../utils/constants';
import { mockSearch } from './mock-api';

export const search = (searchTerm: string) => {
  return async (dispatch: Dispatch) => {
    // make api call to search endpoint
    if (useMockData) {
      mockSearch(dispatch, searchTerm);
    }
  };
};
