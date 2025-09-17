import { Box, Typography, Container } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { FrontPageIllustration } from './FrontPageIllustration';

export const FrontPageHeading = () => {
  const { t } = useTranslation();

  return (
    <Container
      maxWidth="md"
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'center',
        px: '1rem',
        py: { xs: '2rem', sm: '3rem' },
      }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          gap: '1.5rem',
          pr: { xs: 0, sm: '4rem', md: '6rem' },
          py: '1rem',
        }}>
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            color: '#120732',
          }}>
          {t('common.page_title')}
        </Typography>
        <Typography sx={{ fontSize: '1rem' }}>{t('search_in_national_research_publication')}</Typography>
      </Box>
      <FrontPageIllustration />
    </Container>
  );
};
