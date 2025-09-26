import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { VerticalBox } from '../../components/styled/Wrappers';

export const FrontPageHeading = () => {
  const { t } = useTranslation();

  return (
    <VerticalBox sx={{ gap: '1.5rem', mt: { xs: '1rem', sm: '3rem' }, mb: '1rem' }}>
      <Typography component="h1" variant="h1" sx={{ fontSize: { xs: '2.5rem', sm: '3rem' }, color: '#120732' }}>
        {t('common.page_title')}
      </Typography>
      <Typography sx={{ fontSize: '1rem', color: '#120732' }}>
        {t('search_in_national_research_publication')}
      </Typography>
    </VerticalBox>
  );
};
