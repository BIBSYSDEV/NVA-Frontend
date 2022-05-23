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
  const { t } = useTranslation('registration');
  const history = useHistory();

  const handleClickMenuItem = (newPath: string) => {
    onClose();
    if (newPath !== history.location.pathname) {
      history.push(newPath);
    }
  };

  return (
    <Menu
      data-testid={dataTestId.header.generalMenuButton}
      anchorEl={anchorEl}
      keepMounted
      open={!!anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}>
      <MenuItem data-testid={dataTestId.header.aboutLink} onClick={() => handleClickMenuItem(UrlPathTemplate.About)}>
        {t('common:about_nva')}
      </MenuItem>
      <MenuItem
        data-testid={dataTestId.header.privacyLink}
        onClick={() => handleClickMenuItem(UrlPathTemplate.PrivacyPolicy)}>
        {t('privacy:privacy_statement')}
      </MenuItem>
    </Menu>
  );
};
