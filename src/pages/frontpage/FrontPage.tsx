import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const FrontPage = () => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateAreas: "'header' 'search'",
        justifyItems: 'center',
        width: '100%',
        bgcolor: '#EFEFEF',
        paddingTop: '3rem',
        marginBottom: '2rem',
        height: '100vh',
      }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyItems: 'center',
          gridArea: 'header',
        }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyItems: 'center',
            gridArea: 'header',
          }}>
          <Typography
            fontWeight={600}
            sx={{
              fontSize: { xs: '2rem', sm: '2.75rem' },
              color: '#120732',
              marginBottom: '1rem',
            }}>
            {t('common.page_title')}
          </Typography>
          <Typography
            fontWeight={600}
            sx={{
              fontSize: { xs: '0.9rem', sm: '1rem' },
              fontWeight: 500,
            }}>
            {t('search_in_national_research_publication')}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default FrontPage;
