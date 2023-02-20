import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Menu, MenuItem } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import { getLanguageByIso6393Code } from 'nva-language';
import { dataTestId } from '../../utils/dataTestIds';

interface LanguageSelectorProps {
  isMobile?: boolean;
}

const englishTitle = getLanguageByIso6393Code('eng').eng;
const bokmaalTitle = 'Norsk, bokmål';
const nynorskTitle = 'Norsk, nynorsk';

export const LanguageSelector = ({ isMobile }: LanguageSelectorProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const { i18n } = useTranslation();

  const setLanguage = (languageCode: 'nob' | 'eng' | 'nno') => {
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
        {i18n.language === 'nob' ? bokmaalTitle : i18n.language === 'nno' ? nynorskTitle : englishTitle}
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
        <MenuItem disabled={i18n.language === 'nob'} onClick={() => setLanguage('nob')} lang="nb">
          {bokmaalTitle}
        </MenuItem>
        <MenuItem disabled={i18n.language === 'eng'} onClick={() => setLanguage('eng')} lang="en">
          {englishTitle}
        </MenuItem>
        <MenuItem disabled={i18n.language === 'nno'} onClick={() => setLanguage('nno')} lang="nn">
          {nynorskTitle}
        </MenuItem>
      </Menu>
    </>
  );
};
