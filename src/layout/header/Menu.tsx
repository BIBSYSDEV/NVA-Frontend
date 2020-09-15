import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { Button, Menu as MuiMenu, MenuItem, Typography } from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { useSelector } from 'react-redux';
import { RootStore } from '../../redux/reducers/rootReducer';
import NormalText from '../../components/NormalText';

interface MenuProps {
  handleLogout: () => void;
  menuButtonLabel: string;
}

const StyledMenu = styled.div`
  grid-area: menu;
`;

const StyledMuiMenu = styled(MuiMenu)`
  .MuiMenu-list {
    width: 15rem;
    border: 3px solid ${({ theme }) => theme.palette.box.main};

    @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
      width: 10rem;
    }
  }
`;

const StyledMenuButton = styled(Button)`
  width: 15rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    width: 10rem;
  }
`;

const StyledMenuItem = styled(MenuItem)`
  border-bottom: 1px solid ${({ theme }) => theme.palette.box.main};
`;

const StyledAdminMenu = styled.div`
  padding-left: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.palette.box.main};
`;

const StyledNormalText = styled(NormalText)`
  font-weight: bold;
  padding-top: 0.5rem;
  text-transform: uppercase;
`;

const Menu: FC<MenuProps> = ({ menuButtonLabel, handleLogout }) => {
  const user = useSelector((store: RootStore) => store.user);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { t } = useTranslation();
  const history = useHistory();
  const customerId = user.customerId.split('/').pop();

  const handleClickMenuAnchor = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClickMenuItem = (newPath: string) => {
    setAnchorEl(null);
    if (newPath !== history.location.pathname) {
      history.push(newPath);
    }
  };

  return (
    <StyledMenu>
      <StyledMenuButton
        color="primary"
        variant="contained"
        aria-controls="menu"
        aria-haspopup="true"
        onClick={handleClickMenuAnchor}
        data-testid="menu">
        <Typography noWrap>{menuButtonLabel}</Typography>
        {anchorEl ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
      </StyledMenuButton>
      <StyledMuiMenu
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        keepMounted
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}>
        {(user.isAppAdmin || user.isInstitutionAdmin) && (
          <StyledAdminMenu>
            <StyledNormalText>{t('common:admin')}</StyledNormalText>
            {user.isAppAdmin && (
              <MenuItem
                data-testid="menu-admin-institution-button"
                onClick={() => handleClickMenuItem('/admin-institutions')}>
                {t('common:institutions')}
              </MenuItem>
            )}
            {user.isInstitutionAdmin && (
              <>
                <MenuItem
                  data-testid="menu-admin-institution-button"
                  onClick={() => handleClickMenuItem(`/admin-institutions/${customerId}`)}>
                  {t('common:my_institution')}
                </MenuItem>
                <MenuItem
                  data-testid="menu-admin-institution-users-button"
                  onClick={() => handleClickMenuItem('/admin-institution-users')}>
                  {t('common:users')}
                </MenuItem>
              </>
            )}
          </StyledAdminMenu>
        )}

        {user.isCurator && (
          <StyledMenuItem data-testid="menu-my-worklist-button" onClick={() => handleClickMenuItem('/worklist')}>
            {t('workLists:my_worklist')}
          </StyledMenuItem>
        )}
        <StyledMenuItem data-testid="menu-user-profile-button" onClick={() => handleClickMenuItem('/user')}>
          {t('profile:my_profile')}
        </StyledMenuItem>
        <StyledMenuItem onClick={handleLogout} data-testid="menu-logout-button">
          {t('authorization:logout')}
        </StyledMenuItem>
      </StyledMuiMenu>
    </StyledMenu>
  );
};

export default Menu;
