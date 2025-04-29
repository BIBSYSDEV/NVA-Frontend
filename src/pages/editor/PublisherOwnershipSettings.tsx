import AddIcon from '@mui/icons-material/Add';
import { Button, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Trans, useTranslation } from 'react-i18next';
import { fetchClaimedChannels } from '../../api/customerInstitutionsApi';
import { PublicationChannelType } from '../../types/registration.types';
import { dataTestId } from '../../utils/dataTestIds';
import { AddChannelClaimDialog } from './AddChannelClaimDialog';
import { ChannelClaimTable } from './ChannelClaimTable';

export const PublisherOwnershipSettings = () => {
  const { t } = useTranslation();

  const [openAddChannelClaimDialog, setOpenAddChannelClaimDialog] = useState(false);
  const toggleAddChannelClaimDialog = () => setOpenAddChannelClaimDialog(!openAddChannelClaimDialog);

  const channelClaimsQuery = useQuery({
    queryKey: ['channelClaims'],
    queryFn: ({ signal }) => fetchClaimedChannels(signal),
    meta: { errorMessage: t('feedback.error.get_channel_claim') },
  });

  const channelClaimList = channelClaimsQuery.data?.channelClaims;
  return (
    <>
      <Helmet>
        <title>{t('editor.institution.channel_claims.administer_publisher_channel_claim')}</title>
      </Helmet>
      <Typography variant="h1" gutterBottom>
        {t('editor.institution.channel_claims.administer_publisher_channel_claim')}
      </Typography>
      <Trans
        i18nKey="editor.institution.channel_claims.administer_publisher_channel_claim_description"
        components={{
          p: <Typography gutterBottom />,
          button: (
            <Button
              data-testid={dataTestId.editor.addChannelClaimButton}
              variant="outlined"
              startIcon={<AddIcon />}
              sx={{ my: '0.5rem', textTransform: 'none' }}
              onClick={toggleAddChannelClaimDialog}>
              {t('editor.institution.channel_claims.add_publisher_channel_claim')}
            </Button>
          ),
        }}>
        <Typography />
      </Trans>
      <AddChannelClaimDialog
        open={openAddChannelClaimDialog}
        closeDialog={toggleAddChannelClaimDialog}
        refetchClaimedChannels={channelClaimsQuery.refetch}
      />

      {channelClaimList && channelClaimList.length > 0 && (
        <ChannelClaimTable channelClaimList={channelClaimList} channelType={PublicationChannelType.Publisher} />
      )}
    </>
  );
};
