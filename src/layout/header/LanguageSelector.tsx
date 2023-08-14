import PublicIcon from '@mui/icons-material/Public';
import { Button, IconButton, Menu, MenuItem } from '@mui/material';
import { getLanguageByIso6393Code } from 'nva-language';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { dataTestId } from '../../utils/dataTestIds';

interface LanguageSelectorProps {
  isMobile: boolean;
}

const englishTitle = getLanguageByIso6393Code('eng').eng;

export const LanguageSelector = ({ isMobile }: LanguageSelectorProps) => {
  const { i18n, t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const setLanguage = (languageCode: 'nob' | 'eng' | 'nno') => {
    setAnchorEl(null);
    i18n.changeLanguage(languageCode);
  };

  return (
    <>
      {isMobile ? (
        <IconButton
          title={t('common.select_language')}
          color="inherit"
          data-testid={dataTestId.header.languageButton}
          onClick={(event) => setAnchorEl(event.currentTarget)}>
          <PublicIcon fontSize="large" />
        </IconButton>
      ) : (
        <Button
          color="inherit"
          data-testid={dataTestId.header.languageButton}
          onClick={(event) => setAnchorEl(event.currentTarget)}
          title={t('common.select_language')}
          sx={{
            gridArea: 'language',
            justifySelf: 'start',
            display: 'flex',
            flexDirection: 'column',
            '.MuiButton-startIcon': {
              margin: 0,
            },
          }}
          startIcon={<PublicIcon />}>
          {i18n.language === 'nob' ? 'Bokmål' : i18n.language === 'nno' ? 'Nynorsk' : englishTitle}
        </Button>
      )}
      <Menu
        data-testid={dataTestId.header.languageMenu}
        anchorEl={anchorEl}
        keepMounted
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}>
        <MenuItem disabled={i18n.language === 'nob'} onClick={() => setLanguage('nob')} lang="nb">
          Norsk, bokmål
        </MenuItem>
        <MenuItem disabled={i18n.language === 'eng'} onClick={() => setLanguage('eng')} lang="en">
          {englishTitle}
        </MenuItem>
        <MenuItem disabled={i18n.language === 'nno'} onClick={() => setLanguage('nno')} lang="nn">
          Norsk, nynorsk
        </MenuItem>
      </Menu>
    </>
  );
};
