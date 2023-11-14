import { Box, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import reportThumbnail from '../../../resources/images/report-thumbnail.png';
import { UrlPathTemplate } from '../../../utils/urlPaths';

const ReportsPage = () => {
  const { t } = useTranslation();

  return (
    <Button
      component={Link}
      to={UrlPathTemplate.ReportsNvi}
      sx={{
        width: '17rem',
        height: 'fit-content',
        border: '2px solid',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        alignItems: 'center',
        textTransform: 'none',
        justifySelf: { xs: 'center', md: 'start' },
        mb: { xs: '1rem', md: '0' },
      }}>
      <Box
        sx={{
          bgcolor: 'nvi.light',
          alignItems: 'center',
          justifyContent: 'center',
          display: 'flex',
        }}>
        <img src={reportThumbnail} alt="" style={{ height: '70%', width: '70%', padding: '0.5rem' }} />
      </Box>
      <Typography variant="h3">{t('search.reports.nvi_all_institutions_title')}</Typography>
      <Typography>{t('search.reports.nvi_all_institutions_description')}</Typography>
    </Button>
  );
};

export default ReportsPage;
