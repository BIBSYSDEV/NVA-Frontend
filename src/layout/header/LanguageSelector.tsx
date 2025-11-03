import { Box, Button, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { selectDisplayLanguage } from '../../translations/i18n';

export type LanguageCode = 'nob' | 'eng' | 'nno';

export const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const setLanguage = (languageCode: LanguageCode) => {
    i18n.changeLanguage(languageCode);
  };

  const displayLanguage = selectDisplayLanguage(i18n.language);

  return (
    <Box
      sx={{
        gridColumn: { xs: 1, lg: 2 },
        gridRow: { xs: 2, lg: 1 },
        display: 'flex',
        gap: '0.25rem',
      }}>
      <Button
        sx={{ borderBottom: displayLanguage === 'nob' ? '4px solid' : 'none', borderRadius: '0' }}
        color="white"
        size="small"
        onClick={() => setLanguage('nob')}
        lang="nb">
        Bokmål
      </Button>
      <Divider orientation="vertical" flexItem sx={{ bgcolor: 'white', height: '1rem', alignSelf: 'center' }} />
      <Button
        sx={{ borderBottom: displayLanguage === 'nno' ? '4px solid' : 'none', borderRadius: '0' }}
        color="white"
        size="small"
        onClick={() => setLanguage('nno')}
        lang="nn">
        Nynorsk
      </Button>
      <Divider orientation="vertical" flexItem sx={{ bgcolor: 'white', height: '1rem', alignSelf: 'center' }} />

      <Button
        sx={{ borderBottom: displayLanguage === 'eng' ? '4px solid' : 'none', borderRadius: '0' }}
        color="white"
        size="small"
        onClick={() => setLanguage('eng')}
        lang="en">
        English
      </Button>
    </Box>
  );
};
