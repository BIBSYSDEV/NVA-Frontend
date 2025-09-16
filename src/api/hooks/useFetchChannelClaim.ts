import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getIdentifierFromId, removeTrailingYearPathFromUrl } from '../../utils/general-helpers';
import { PublicationChannelApiPath } from '../apiPaths';
import { fetchChannelClaim } from '../customerInstitutionsApi';

export const useFetchChannelClaim = (id = '', { enabled = !!id } = {}) => {
  const { t } = useTranslation();

  const isChannelId =
    id.includes(PublicationChannelApiPath.Publisher) || id.includes(PublicationChannelApiPath.SerialPublication);

  const channelIdentifier = isChannelId ? getIdentifierFromId(removeTrailingYearPathFromUrl(id)) : '';

  return useQuery({
    queryKey: ['channelClaim', channelIdentifier],
    enabled: enabled && !!channelIdentifier,
    queryFn: async ({ signal }) => {
      try {
        return await fetchChannelClaim(channelIdentifier, signal);
      } catch (error: any) {
        if (error.status === 404) {
          return null; // Handle 404 as an OK response with no data
        }
        throw error;
      }
    },
    staleTime: 120_000, // 2 minutes
    meta: { errorMessage: t('feedback.error.get_channel_claim') },
  });
};
