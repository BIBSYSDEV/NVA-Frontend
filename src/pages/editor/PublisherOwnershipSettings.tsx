import AddIcon from '@mui/icons-material/Add';
import { Button, Typography } from '@mui/material';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Trans, useTranslation } from 'react-i18next';
import { AddChannelOwnershipDialog } from './AddChannelOwnershipDialog';

export const PublisherOwnershipSettings = () => {
  const { t } = useTranslation();

  const [openAddOwnershipDialog, setOpenAddOwnershipDialog] = useState(false);
  const toggleAddOwnershipDialog = () => setOpenAddOwnershipDialog(!openAddOwnershipDialog);

  return (
    <>
      <Helmet>
        <title>{t('editor.institution.administer_publisher_channel_ownership')}</title>
      </Helmet>
      <Typography variant="h1" gutterBottom>
        {t('editor.institution.administer_publisher_channel_ownership')}
      </Typography>
      <Trans
        i18nKey="editor.institution.administer_publisher_channel_ownership_description"
        components={{
          p: <Typography gutterBottom />,
          addOwnershipButton: (
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              sx={{ my: '0.5rem', textTransform: 'none' }}
              onClick={toggleAddOwnershipDialog}>
              {t('editor.institution.add_publisher_channel_ownership')}
            </Button>
          ),
        }}>
        <Typography />
      </Trans>
      <AddChannelOwnershipDialog
        channelType="Publisher"
        open={openAddOwnershipDialog}
        closeDialog={toggleAddOwnershipDialog}
      />
    </>
  );
};
