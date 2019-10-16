import { Dispatch } from 'redux';

import { useMockData } from '../utils/constants';
import { mockSearch } from './mock-api';

export const search = (searchTerm: string, offset?: number) => {
  return async (dispatch: Dispatch) => {
    // make api call to search endpoint
    if (useMockData) {
      mockSearch(dispatch, searchTerm, offset ? offset : 0);
    }
  };
};
