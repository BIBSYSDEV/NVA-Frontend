import AddIcon from '@mui/icons-material/Add';
import { Button, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { Trans, useTranslation } from 'react-i18next';
import { dataTestId } from '../../utils/dataTestIds';
import { useState } from 'react';

export const SeriesOwnershipSettings = () => {
  const { t } = useTranslation();

  const [openAddChannelClaimDialog, setOpenAddChannelClaimDialog] = useState(false);
  const toggleAddChannelClaimDialog = () => setOpenAddChannelClaimDialog(!openAddChannelClaimDialog);

  return (
    <>
      <Helmet>
        <title>{t('editor.institution.channel_claims.administer_series_channel_claim')}</title>
      </Helmet>
      <Typography variant="h1" gutterBottom>
        {t('editor.institution.channel_claims.administer_series_channel_claim')}
      </Typography>
      <Trans
        i18nKey="editor.institution.channel_claims.administer_series_channel_claim_description"
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
        }}
      />
    </>
  );
};
