import AddIcon from '@mui/icons-material/Add';
import { Button, Typography } from '@mui/material';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Trans, useTranslation } from 'react-i18next';
import { dataTestId } from '../../utils/dataTestIds';

export const SerialPublicationClaimsSettings = () => {
  const { t } = useTranslation();

  const [openAddChannelClaimDialog, setOpenAddChannelClaimDialog] = useState(false);
  const toggleAddChannelClaimDialog = () => setOpenAddChannelClaimDialog(!openAddChannelClaimDialog);

  return (
    <>
      <Helmet>
        <title>{t('editor.institution.channel_claims.administer_serial_publication_channel_claim')}</title>
      </Helmet>
      <Typography variant="h1" gutterBottom>
        {t('editor.institution.channel_claims.administer_serial_publication_channel_claim')}
      </Typography>
      <Trans
        i18nKey="editor.institution.channel_claims.administer_serial_publication_channel_claim_description"
        components={{
          p: <Typography gutterBottom />,
          button: (
            <Button
              data-testid={dataTestId.editor.addChannelClaimButton}
              variant="outlined"
              startIcon={<AddIcon />}
              sx={{ my: '0.5rem', textTransform: 'none' }}
              onClick={toggleAddChannelClaimDialog}>
              {t('editor.institution.channel_claims.add_serial_publication_channel_claim')}
            </Button>
          ),
        }}
      />
    </>
  );
};
