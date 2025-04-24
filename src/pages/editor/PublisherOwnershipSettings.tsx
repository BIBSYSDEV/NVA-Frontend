import { Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchClaimedChannels } from '../../api/customerInstitutionsApi';
import { PublicationChannelType } from '../../types/registration.types';
import { ChannelClaimTable } from './ChannelClaimTable';

export const PublisherOwnershipSettings = () => {
  const { t } = useTranslation();

  const channelClaimsQuery = useQuery({
    queryKey: ['channelClaims'],
    queryFn: ({ signal }) => fetchClaimedChannels(signal),
    meta: { errorMessage: t('feedback.error.get_channel_claim') },
  });

  const channelClaimList = channelClaimsQuery.data?.channelClaims;
  return (
    <>
      <Typography variant="h1" gutterBottom>
        {t('editor.institution.administer_publisher_channel_ownership')}
      </Typography>
      {channelClaimList && channelClaimList.length > 0 && (
        <ChannelClaimTable channelClaimList={channelClaimList} channelType={PublicationChannelType.Publisher} />
      )}
    </>
  );
};
