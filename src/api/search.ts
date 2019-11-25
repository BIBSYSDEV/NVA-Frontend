import Axios from 'axios';
import { Dispatch } from 'redux';

import { searchFailure, searchForResources } from '../redux/actions/searchActions';
import i18n from '../translations/i18n';
import { ApiBaseUrl, SEARCH_RESULTS_PER_PAGE } from '../utils/constants';

export const search = (searchTerm: string, offset?: number) => {
  return async (dispatch: Dispatch) => {
    Axios.get(`/${ApiBaseUrl.RESOURCES}/${searchTerm}`)
      .then(response => {
        const currentOffset = offset || 0;
        const result = response.data.slice(currentOffset, currentOffset + SEARCH_RESULTS_PER_PAGE);
        dispatch(searchForResources(result, searchTerm, response.data.length, offset));
      })
      .catch(() => {
        dispatch(searchFailure(i18n.t('feedback:error.search')));
      });
  };
};
