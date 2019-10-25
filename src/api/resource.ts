import { Dispatch } from 'redux';

import { Search } from './mock-api';

export const search = (searchTerm: string, offset?: number) => {
  return async (dispatch: Dispatch) => {
    Search(dispatch, searchTerm, offset ? offset : 0);
  };
};
