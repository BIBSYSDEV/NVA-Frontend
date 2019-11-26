import axios from 'axios';

import { StatusCode, ApiBaseUrl } from '../../utils/constants';

// Authority VIAF API docs: https://platform.worldcat.org/api-explorer/apis/VIAF

export const getViafData = async (viafId: number | string) => {
  const url = `${ApiBaseUrl.VIAF_EXTERNAL}/${viafId}/?httpAccept=application/json`;
  const response = await axios.get(url);

  if (response.status === StatusCode.OK) {
    return response.data;
  } else {
    return {};
  }
};
