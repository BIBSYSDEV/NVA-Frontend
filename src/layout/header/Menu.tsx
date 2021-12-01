import { useState, MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import {
  Button,
  Menu as MuiMenu,
  MenuItem,
  Typography,
  Divider,
  Theme,
  useMediaQuery,
  IconButton,
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircleOutlined';
import { useSelector } from 'react-redux';
import { RootStore } from '../../redux/reducers/rootReducer';
import { UrlPathTemplate } from '../../utils/urlPaths';
import { LanguageSelector } from './LanguageSelector';
import { dataTestId } from '../../utils/dataTestIds';

const StyledMenu = styled.div`
  grid-area: user-items;
`;

const StyledMenuButton = styled(Button)`
  text-transform: none;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  width: 100%;
  height: 100%;
`;

interface MenuProps {
  handleLogout: () => void;
}

export const Menu = ({ handleLogout }: MenuProps) => {
  const { t } = useTranslation();
  const user = useSelector((store: RootStore) => store.user);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const name = user?.name ?? '';

  const handleClickMenuAnchor = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => setAnchorEl(null);

  return (
    <StyledMenu>
      {isMobile ? (
        <IconButton onClick={handleClickMenuAnchor} title={name} color="inherit">
          <AccountCircle fontSize="large" />
        </IconButton>
      ) : (
        <StyledMenuButton
          color="inherit"
          data-testid={dataTestId.header.menuButton}
          onClick={handleClickMenuAnchor}
          startIcon={<AccountCircle />}>
          <Typography noWrap color="inherit">
            {name}
          </Typography>
        </StyledMenuButton>
      )}
      <MuiMenu
        anchorEl={anchorEl}
        keepMounted
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}>
        {isMobile && (
          <>
            <MenuItem divider>
              <LanguageSelector />
            </MenuItem>
            {user?.isCurator && (
              <MenuItem
                key={dataTestId.header.worklistLink}
                data-testid={dataTestId.header.worklistLink}
                onClick={closeMenu}
                component={StyledLink}
                to={UrlPathTemplate}>
                <Typography>{t('workLists:worklist')}</Typography>
              </MenuItem>
            )}
            {user?.isCreator && (
              <MenuItem
                key={'dataTestId.header.messagesLink'}
                data-testid={'dataTestId.header.messagesLink'}
                onClick={closeMenu}
                component={StyledLink}
                to={UrlPathTemplate.MyMessages}>
                <Typography>{t('workLists:messages')}</Typography>
              </MenuItem>
            )}
          </>
        )}
        {user?.isCreator && [
          <MenuItem
            key={'dataTestId.header.myRegistrationsLink'}
            data-testid={'dataTestId.header.myRegistrationsLink'}
            onClick={closeMenu}
            component={StyledLink}
            to={UrlPathTemplate.MyRegistrations}>
            <Typography>{t('workLists:my_registrations')}</Typography>
          </MenuItem>,
        ]}
        {user?.isEditor && (
          <MenuItem
            divider
            key={dataTestId.header.editorLink}
            data-testid={dataTestId.header.editorLink}
            onClick={closeMenu}
            component={StyledLink}
            to={UrlPathTemplate.Editor}>
            <Typography>{t('profile:roles.editor')}</Typography>
          </MenuItem>
        )}
        {(user?.isAppAdmin || user?.isInstitutionAdmin) && [
          user.isAppAdmin && (
            <MenuItem
              key={dataTestId.header.adminInstitutionsLink}
              data-testid={dataTestId.header.adminInstitutionsLink}
              onClick={closeMenu}
              component={StyledLink}
              to={UrlPathTemplate.AdminInstitutions}>
              <Typography>{t('common:institutions')}</Typography>
            </MenuItem>
          ),
          user.isInstitutionAdmin && [
            <MenuItem
              key={dataTestId.header.adminInstitutionLink}
              data-testid={dataTestId.header.adminInstitutionLink}
              onClick={closeMenu}
              component={StyledLink}
              to={UrlPathTemplate.MyInstitution}>
              <Typography>{t('common:my_institution')}</Typography>
            </MenuItem>,
            <MenuItem
              key={dataTestId.header.adminUsersLink}
              data-testid={dataTestId.header.adminUsersLink}
              onClick={closeMenu}
              component={StyledLink}
              to={UrlPathTemplate.MyInstitutionUsers}>
              <Typography>{t('common:users')}</Typography>
            </MenuItem>,
          ],
          <Divider key="divider1" />,
        ]}
        <MenuItem
          data-testid={dataTestId.header.myProfileLink}
          onClick={closeMenu}
          component={StyledLink}
          to={UrlPathTemplate.MyProfile}>
          <Typography>{t('profile:my_profile')}</Typography>
        </MenuItem>
        <MenuItem data-testid={dataTestId.header.logOutLink} onClick={handleLogout}>
          {t('authorization:logout')}
        </MenuItem>
      </MuiMenu>
    </StyledMenu>
  );
};
