import { Menu, MenuItem } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { dataTestId } from '../../utils/dataTestIds';
import { UrlPathTemplate } from '../../utils/urlPaths';

interface GeneralMenuProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
}

export const GeneralMenu = ({ anchorEl, onClose }: GeneralMenuProps) => {
  const { t } = useTranslation();
  const history = useHistory();

  const handleClickMenuItem = (newPath: string) => {
    onClose();
    if (newPath !== history.location.pathname) {
      history.push(newPath);
    }
  };

  return (
    <Menu
      anchorEl={anchorEl}
      keepMounted
      open={!!anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}>
      <MenuItem
        divider
        data-testid={dataTestId.header.aboutLink}
        onClick={() => handleClickMenuItem(UrlPathTemplate.About)}>
        {t('about.about_nva')}
      </MenuItem>
      <MenuItem
        data-testid={dataTestId.header.privacyLink}
        onClick={() => handleClickMenuItem(UrlPathTemplate.PrivacyPolicy)}>
        {t('privacy.privacy_statement')}
      </MenuItem>
      <MenuItem
        data-testid={dataTestId.header.availabilityStatement}
        component="a"
        target="_blank"
        rel="noopener noreferrer"
        href={'https://uustatus.no/nb/erklaringer/publisert/bffb4b1d-25eb-4fe0-bac7-2f0b4a8e0fd9'}>
        {t('about.availability_statement')}
      </MenuItem>
    </Menu>
  );
};
