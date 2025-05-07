import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getIdentifierFromId } from '../../utils/general-helpers';
import { fetchChannelClaim } from '../customerInstitutionsApi';

export const useFetchChannelClaim = (id = '') => {
  const { t } = useTranslation();
  const channelIdWithoutYear = id.replace(/\/\d{4}$/, ''); // TODO: move this and similar at AddChannelClaimDialog to helper function
  const channelIdentifier = getIdentifierFromId(channelIdWithoutYear);

  return useQuery({
    queryKey: ['channelClaim', channelIdentifier],
    enabled: !!channelIdentifier,
    queryFn: ({ signal }) => fetchChannelClaim(channelIdentifier, signal),
    meta: { errorMessage: t('feedback.error.get_channel_claim') },
  });
};
