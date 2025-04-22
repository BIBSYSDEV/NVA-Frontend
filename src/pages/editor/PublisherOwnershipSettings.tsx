import AddIcon from '@mui/icons-material/Add';
import { Button, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { Trans, useTranslation } from 'react-i18next';

export const PublisherOwnershipSettings = () => {
  const { t } = useTranslation();

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
            <Button variant="outlined" startIcon={<AddIcon />} sx={{ my: '0.5rem', textTransform: 'none' }}>
              {t('editor.institution.add_publisher_channel_ownership')}
            </Button>
          ),
        }}>
        <Typography />
      </Trans>
    </>
  );
};
