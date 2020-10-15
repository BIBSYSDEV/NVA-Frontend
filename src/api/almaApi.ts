import Axios, { CancelToken } from 'axios';
import { StatusCode } from '../utils/constants';
import i18n from '../translations/i18n';

enum AlmaApiPaths {
  ALMA = '/alma',
}

export const getAlmaPublication = async (
  systemControlNumber: string,
  invertedCreatorName: string,
  cancelToken?: CancelToken
) => {
  const url = encodeURI(`${AlmaApiPaths.ALMA}/?scn=${systemControlNumber}&creatorname=${invertedCreatorName}`);
  try {
    const response = await Axios.get(url, { cancelToken });

    if (response.status === StatusCode.OK) {
      return response.data;
    } else {
      return { error: i18n.t('feedback:error.get_last_publication') };
    }
  } catch (error) {
    if (!Axios.isCancel(error)) {
      return { error: i18n.t('feedback:error.get_last_publication') };
    }
  }
};
