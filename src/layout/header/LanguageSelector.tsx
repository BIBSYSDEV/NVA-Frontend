import { Box, Button, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { LanguageCode6393 } from '../../translations/language.types';
import { useAppLanguageInIso6393Format } from '../../translations/translation-helpers';

export const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const appLanguage = useAppLanguageInIso6393Format();

  const setLanguage = (languageCode: LanguageCode6393) => {
    i18n.changeLanguage(languageCode);
  };

  return (
    <Box
      sx={{
        gridColumn: { xs: 1, lg: 2 },
        gridRow: { xs: 2, lg: 1 },
        display: 'flex',
        gap: '0.25rem',
      }}>
      <Button
        sx={{ borderBottom: appLanguage === 'nob' ? '4px solid' : 'none', borderRadius: '0' }}
        color="white"
        size="small"
        onClick={() => setLanguage('nob')}
        lang="nb">
        Bokmål
      </Button>
      <Divider orientation="vertical" flexItem sx={{ bgcolor: 'white', height: '1rem', alignSelf: 'center' }} />
      <Button
        sx={{ borderBottom: appLanguage === 'nno' ? '4px solid' : 'none', borderRadius: '0' }}
        color="white"
        size="small"
        onClick={() => setLanguage('nno')}
        lang="nn">
        Nynorsk
      </Button>
      <Divider orientation="vertical" flexItem sx={{ bgcolor: 'white', height: '1rem', alignSelf: 'center' }} />

      <Button
        sx={{ borderBottom: appLanguage === 'eng' ? '4px solid' : 'none', borderRadius: '0' }}
        color="white"
        size="small"
        onClick={() => setLanguage('eng')}
        lang="en">
        English
      </Button>
    </Box>
  );
};
