import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const PublisherClaimsOverview = () => {
  const { t } = useTranslation();

  return <Typography variant="h1"> {t('editor.institution.channel_claims.publisher_claims_overview')}</Typography>;
};
