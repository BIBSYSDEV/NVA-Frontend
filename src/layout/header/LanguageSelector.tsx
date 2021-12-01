import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Menu, MenuItem } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import { LanguageCodes } from '../../types/language.types';
import { dataTestId } from '../../utils/dataTestIds';

export const LanguageSelector = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const { t, i18n } = useTranslation();

  const setLanguage = (languageCode: LanguageCodes) => {
    setAnchorEl(null);
    i18n.changeLanguage(languageCode);
  };

  return (
    <>
      <Button
        color="inherit"
        data-testid={dataTestId.header.languageButton}
        startIcon={<LanguageIcon />}
        onClick={(event) => setAnchorEl(event.currentTarget)}>
        {i18n.language === LanguageCodes.NORWEGIAN_BOKMAL ? t('languages:nor') : t(`languages:${i18n.language}`)}
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
        <MenuItem
          disabled={i18n.language === LanguageCodes.NORWEGIAN_BOKMAL}
          onClick={() => setLanguage(LanguageCodes.NORWEGIAN_BOKMAL)}>
          {t('languages:nor')}
        </MenuItem>
        <MenuItem disabled={i18n.language === LanguageCodes.ENGLISH} onClick={() => setLanguage(LanguageCodes.ENGLISH)}>
          {t('languages:eng')}
        </MenuItem>
      </Menu>
    </>
  );
};
