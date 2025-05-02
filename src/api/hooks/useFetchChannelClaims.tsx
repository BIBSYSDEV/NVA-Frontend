import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ChannelClaimType } from '../../types/customerInstitution.types';
import { fetchClaimedChannels } from '../customerInstitutionsApi';

export const useFetchChannelClaims = (channelType: ChannelClaimType) => {
  const { t } = useTranslation();

  return useQuery({
    queryKey: ['channelClaims', channelType],
    queryFn: ({ signal }) => fetchClaimedChannels(channelType, signal),
    meta: { errorMessage: t('feedback.error.get_channel_claim') },
  });
};
