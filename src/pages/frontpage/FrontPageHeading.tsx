import { Box, Theme, Typography, useMediaQuery } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { VerticalBox } from '../../components/styled/Wrappers';
import illustration from '../../resources/images/front-page-illustration.svg';

export const FrontPageHeading = () => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '12rem',
        mt: { xs: '1rem', sm: '3rem' },
        px: '3rem',
      }}>
      <VerticalBox sx={{ gap: '1.5rem', mb: '1rem' }}>
        <Typography variant="h1" sx={{ fontSize: { xs: '2.25rem', sm: '3rem' }, color: 'primary.main' }}>
          {t('common.page_title')}
        </Typography>
        <Typography sx={{ fontSize: '1rem', color: 'primary.main' }}>
          {t('search_in_national_research_publication')}
        </Typography>
      </VerticalBox>
      {!isMobile && <img src={illustration} alt="" height="200" />}
    </Box>
  );
};
