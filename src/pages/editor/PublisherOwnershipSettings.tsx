import { Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchChannelClaims } from '../../api/customerInstitutionsApi';
import { ChannelClaimTable } from './ChannelClaimTable';
import { PublicationChannelType } from '../../types/registration.types';

export const PublisherOwnershipSettings = () => {
  const { t } = useTranslation();

  const channelClaimsQuery = useQuery({
    queryKey: ['channelClaims'],
    queryFn: fetchChannelClaims,
  });

  const channelClaims = channelClaimsQuery.data?.channelClaims;
  return (
    <>
      <Typography variant="h1" gutterBottom>
        {t('editor.institution.administer_publisher_channel_ownership')}
      </Typography>
      {channelClaims && channelClaims.length > 0 && (
        <ChannelClaimTable channelClaimList={channelClaims} channelType={PublicationChannelType.Publisher} />
      )}
    </>
  );
};
