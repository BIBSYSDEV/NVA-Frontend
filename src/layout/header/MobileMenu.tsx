import { useRef } from 'react';
import { Menu, MenuItem } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { dataTestId } from '../../utils/dataTestIds';
import { UrlPathTemplate } from '../../utils/urlPaths';

interface MobileMenuProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
}

export const MobileMenu = ({ anchorEl, onClose }: MobileMenuProps) => {
  const { t } = useTranslation('registration');
  const history = useHistory();
  const divRef = useRef<any>();

  const handleClickMenuItem = (newPath: string) => {
    onClose();
    if (newPath !== history.location.pathname) {
      history.push(newPath);
    }
  };

  return (
    <div ref={divRef}>
      <Menu
        anchorEl={anchorEl}
        container={divRef.current}
        keepMounted
        open={!!anchorEl}
        onClose={onClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}>
        <MenuItem data-testid={dataTestId.footer.aboutLink} onClick={() => handleClickMenuItem(UrlPathTemplate.About)}>
          {t('common:about_nva')}
        </MenuItem>
        <MenuItem
          data-testid={dataTestId.footer.privacyLink}
          onClick={() => handleClickMenuItem(UrlPathTemplate.PrivacyPolicy)}>
          {t('privacy:privacy_statement')}
        </MenuItem>
      </Menu>
    </div>
  );
};
