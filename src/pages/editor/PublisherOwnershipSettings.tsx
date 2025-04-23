import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { fetchChannelClaims } from '../../api/customerInstitutionsApi';
import { useQuery } from '@tanstack/react-query';

export const PublisherOwnershipSettings = () => {
  const { t } = useTranslation();

  const channelClaimsQuery = useQuery({
    queryKey: ['channelClaims'],
    queryFn: fetchChannelClaims,
  });

  const channelClaims = channelClaimsQuery.data?.channelClaims;
  console.log(channelClaims && channelClaims);

  return (
    <>
      <Typography variant="h1" gutterBottom>
        {t('editor.institution.administer_publisher_channel_ownership')}
      </Typography>
      {!!channelClaims &&
        channelClaims.length > 0 &&
        channelClaims.map((channelClaim) => {
          return (
            <Typography key={channelClaim.claimedBy.id} gutterBottom>
              {channelClaim.claimedBy.organizationId}
            </Typography>
          );
        })}
    </>
  );
};
