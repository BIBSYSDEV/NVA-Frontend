import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import reportThumbnail from '../../../resources/images/report-thumbnail.png';

const ReportsPage = () => {
  const { t } = useTranslation();

  const [selectedReport, setSelectdReport] = useState('');

  return selectedReport ? (
    <>
      <IconButton title={t('common.back')} onClick={() => setSelectdReport('')}>
        <ArrowBackIcon />
      </IconButton>
      <iframe
        style={{ border: 'none', height: '80vh' }}
        title={t('common.nvi')}
        width="100%"
        src="https://rapport-dv.uhad.no/t/DUCT/views/nettsider_2022_14_04_v2/NVI2011-2022?%3Aembed=y&%3AloadOrderID=0&%3Adisplay_spinner=yes&%3AshowAppBanner=false&%3Atoolbar=yes&%3Atabs=no"
      />
    </>
  ) : (
    <Button
      onClick={() => setSelectdReport('NVI')}
      sx={{
        width: '17rem',
        height: 'fit-content',
        border: '2px solid',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        alignItems: 'center',
        textTransform: 'none',
        justifySelf: { xs: 'center', md: 'start' },
        mb: { xs: '1rem', md: '0' },
      }}>
      <Box
        sx={{
          height: '40%',
          width: '100%',
          bgcolor: 'nvi.light',
          alignItems: 'center',
          justifyContent: 'center',
          display: 'flex',
        }}>
        <img src={reportThumbnail} alt="" style={{ height: '70%', width: '70%', padding: '0.5rem' }} />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'start', px: '0.5rem' }}>
        <Typography variant="h3">{t('search.reports.nvi_all_institutions_title')}</Typography>
        <Typography>{t('search.reports.nvi_all_institutions_description')}</Typography>
      </Box>
    </Button>
  );
};

export default ReportsPage;
