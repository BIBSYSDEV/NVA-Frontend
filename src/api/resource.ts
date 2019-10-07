import { Dispatch } from 'redux';

import { useMockData } from '../utils/constants';
import { mockGetResources } from './mock-api';

export const getResources = () => {
  return async (dispatch: Dispatch) => {
    if (useMockData) {
      mockGetResources(dispatch);
    }
  };
};
