import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const SerialPublicationClaimsOverview = () => {
  const { t } = useTranslation();

  return (
    <Typography variant="h1"> {t('editor.institution.channel_claims.serial_publication_claims_overview')}</Typography>
  );
};
