import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Menu, MenuItem } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import { getLanguageByIso6393Code } from 'nva-language';
import { dataTestId } from '../../utils/dataTestIds';

interface LanguageSelectorProps {
  isMobile?: boolean;
}

const englishLanguage = getLanguageByIso6393Code('eng');

export const LanguageSelector = ({ isMobile }: LanguageSelectorProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const { i18n } = useTranslation();

  const setLanguage = (languageCode: string) => {
    setAnchorEl(null);
    i18n.changeLanguage(languageCode);
  };

  return (
    <>
      <Button
        color="inherit"
        fullWidth={!!isMobile}
        data-testid={dataTestId.header.languageButton}
        startIcon={<LanguageIcon />}
        onClick={(event) => setAnchorEl(event.currentTarget)}>
        {i18n.language === 'nob' ? 'Norsk' : englishLanguage.eng}
      </Button>
      <Menu
        data-testid={dataTestId.header.languageMenu}
        anchorEl={anchorEl}
        keepMounted
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}>
        <MenuItem disabled={i18n.language === 'nob'} onClick={() => setLanguage('nob')}>
          Norsk
        </MenuItem>
        <MenuItem disabled={i18n.language === 'eng'} onClick={() => setLanguage('eng')}>
          {englishLanguage.eng}
        </MenuItem>
      </Menu>
    </>
  );
};
