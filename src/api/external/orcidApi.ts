import Axios from 'axios';
import { ORCID_USER_INFO_URL } from '../../utils/constants';

interface OrcidInfo {
  id: string;
}

export const getOrcidInfo = async (orcidAccessToken: string) => {
  return await Axios.post<OrcidInfo>(ORCID_USER_INFO_URL, null, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${orcidAccessToken}`,
    },
  });
  //   const response = await Axios<OrcidInfo>({
  //     method: 'POST',
  //     url: ORCID_USER_INFO_URL,
  //     headers: {
  //       Accept: 'application/json',
  //       Authorization: `Bearer ${orcidAccessToken}`,
  //     },
  //   });
  //   if (response.status === StatusCode.OK) {
  //     dispatch(setExternalOrcid(response.data.sub));
  //   } else {
  //     dispatch(setNotification(i18n.t('feedback:error.get_orcid', NotificationVariant.Error)));
  //   }
  // } catch {
  //   dispatch(setNotification(i18n.t('feedback:error.get_orcid', NotificationVariant.Error)));
  //   }
  // }
};
