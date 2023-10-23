import { Box, Button, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import gbFlag from '../../resources/images/GB.svg';
import norFlag from '../../resources/images/Norsk.svg';

export const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const setLanguage = (languageCode: 'nob' | 'eng' | 'nno') => {
    i18n.changeLanguage(languageCode);
  };

  return (
    <Box
      sx={{
        gridColumn: { xs: 1, lg: 2 },
        gridRow: { xs: 2, lg: 1 },
        justifySelf: 'center',
        display: 'flex',
        gap: '0.25rem',
      }}>
      <Button
        startIcon={<img src={norFlag} alt="" style={{ width: '1.5rem' }} />}
        sx={{ borderBottom: i18n.language === 'nob' ? '4px solid' : 'none', borderRadius: '0' }}
        size="small"
        onClick={() => setLanguage('nob')}
        lang="nb">
        Bokmål
      </Button>
      <Divider orientation="vertical" flexItem sx={{ bgcolor: 'primary.main', height: '1rem', alignSelf: 'center' }} />
      <Button
        sx={{ borderBottom: i18n.language === 'nno' ? '4px solid' : 'none', borderRadius: '0' }}
        size="small"
        onClick={() => setLanguage('nno')}
        lang="nn">
        Nynorsk
      </Button>
      <Divider orientation="vertical" flexItem sx={{ bgcolor: 'primary.main', height: '1rem', alignSelf: 'center' }} />

      <Button
        startIcon={<img src={gbFlag} alt="" style={{ width: '1.5rem' }} />}
        sx={{ borderBottom: i18n.language === 'eng' ? '4px solid' : 'none', borderRadius: '0' }}
        size="small"
        onClick={() => setLanguage('eng')}
        lang="en">
        English
      </Button>
    </Box>
  );
};
