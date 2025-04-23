import AddIcon from '@mui/icons-material/Add';
import { Button, Typography } from '@mui/material';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Trans, useTranslation } from 'react-i18next';
import { AddChannelClaimDialog } from './AddChannelClaimDialog';

export const PublisherOwnershipSettings = () => {
  const { t } = useTranslation();

  const [openAddChannelClaimDialog, setOpenAddChannelClaimDialog] = useState(false);
  const toggleAddChannelCLaimDialog = () => setOpenAddChannelClaimDialog(!openAddChannelClaimDialog);

  return (
    <>
      <Helmet>
        <title>{t('editor.institution.administer_publisher_channel_claim')}</title>
      </Helmet>
      <Typography variant="h1" gutterBottom>
        {t('editor.institution.administer_publisher_channel_claim')}
      </Typography>
      <Trans
        i18nKey="editor.institution.administer_publisher_channel_claim_description"
        components={{
          p: <Typography gutterBottom />,
          addOwnershipButton: (
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              sx={{ my: '0.5rem', textTransform: 'none' }}
              onClick={toggleAddChannelCLaimDialog}>
              {t('editor.institution.add_publisher_channel_claim')}
            </Button>
          ),
        }}>
        <Typography />
      </Trans>
      <AddChannelClaimDialog open={openAddChannelClaimDialog} closeDialog={toggleAddChannelCLaimDialog} />
    </>
  );
};
