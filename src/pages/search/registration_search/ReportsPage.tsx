import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const ReportsPage = () => {
  const { t } = useTranslation();

  const [selectedReport, setSelectdReport] = useState('');

  return selectedReport ? (
    <Box>
      <IconButton title={t('common.back')} onClick={() => setSelectdReport('')}>
        <ArrowBackIcon />
      </IconButton>
      <iframe
        style={{ border: 'none', height: '80vh' }}
        id="inlineFrameExample"
        title="NVI"
        width="100%"
        src="https://rapport-dv.uhad.no/t/DUCT/views/NVI-rapporteringtilCristinnettsidenny/NVI-resultatertilcristin_no?%3Aembed_code_version=3&%3Aembed=y&%3AloadOrderID=0&%3Adisplay_spinner=yes&%3AshowAppBanner=false&%3Atoolbar=yes&%3Atabs=no"
      />
    </Box>
  ) : (
    <Button
      onClick={() => setSelectdReport('NVI')}
      sx={{
        width: '20rem',
        height: '25rem',
        border: '2px solid',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around',
        gap: '2rem',
        textTransform: 'none',
      }}>
      <Box sx={{ height: '40%', width: '100%', bgcolor: 'nvi.light' }}></Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Typography variant="h3">NVI: resultat, publiseringsindeks og bidragsyter andel per institusjon</Typography>
        <Typography>Nasjonalt, internasjonalt og uten samarbeid</Typography>
      </Box>
    </Button>
  );
};
