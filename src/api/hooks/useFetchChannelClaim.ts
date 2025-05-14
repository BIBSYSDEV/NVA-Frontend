import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getIdentifierFromId, removeTrailingYearPathFromUrl } from '../../utils/general-helpers';
import { fetchChannelClaim } from '../customerInstitutionsApi';

export const useFetchChannelClaim = (id = '', { enabled = !!id }) => {
  const { t } = useTranslation();
  const channelIdentifier = getIdentifierFromId(removeTrailingYearPathFromUrl(id));

  return useQuery({
    queryKey: ['channelClaim', channelIdentifier],
    enabled: enabled && !!channelIdentifier,
    queryFn: ({ signal }) => fetchChannelClaim(channelIdentifier, signal),
    meta: { errorMessage: t('feedback.error.get_channel_claim') },
  });
};
