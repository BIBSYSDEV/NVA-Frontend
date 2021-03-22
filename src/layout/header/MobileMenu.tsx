import React from 'react';
import { Menu, MenuItem } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface MobileMenuProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
}

export const MobileMenu = ({ anchorEl, onClose }: MobileMenuProps) => {
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
      anchorEl={anchorEl}
      keepMounted
      open={!!anchorEl}
      onClose={onClose}
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}>
      <MenuItem data-testid="mobile-new-registration" onClick={() => handleClickMenuItem('/registration')}>
        {t('new_registration')}
      </MenuItem>
      <MenuItem data-testid="mobile-my-registrations" onClick={() => handleClickMenuItem('/my-registrations')}>
        {t('workLists:my_registrations')}
      </MenuItem>
      <MenuItem data-testid="mobile-my-messages" onClick={() => handleClickMenuItem('/my-messages')}>
        {t('workLists:my_messages')}
      </MenuItem>
    </Menu>
  );
};
