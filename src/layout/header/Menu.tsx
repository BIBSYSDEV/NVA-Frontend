import { useState, MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Button,
  Menu as MuiMenu,
  MenuItem,
  Typography,
  Divider,
  Theme,
  useMediaQuery,
  IconButton,
  Box,
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircleOutlined';
import { useSelector } from 'react-redux';
import { RootStore } from '../../redux/reducers/rootReducer';
import { UrlPathTemplate } from '../../utils/urlPaths';
import { LanguageSelector } from './LanguageSelector';
import { dataTestId } from '../../utils/dataTestIds';

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
    <Box sx={{ gridArea: 'user-items' }}>
      {isMobile ? (
        <IconButton onClick={handleClickMenuAnchor} title={name} color="inherit">
          <AccountCircle fontSize="large" />
        </IconButton>
      ) : (
        <Button
          color="inherit"
          data-testid={dataTestId.header.menuButton}
          onClick={handleClickMenuAnchor}
          startIcon={<AccountCircle />}
          sx={{ textTransform: 'none' }}>
          <Typography noWrap color="inherit">
            {name}
          </Typography>
        </Button>
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
        {isMobile && [
          <MenuItem divider key={dataTestId.header.languageButton}>
            <LanguageSelector isMobile={true} />
          </MenuItem>,
          user?.isCurator && (
            <MenuItem
              key={dataTestId.header.worklistLink}
              data-testid={dataTestId.header.worklistLink}
              onClick={closeMenu}
              component={Link}
              to={UrlPathTemplate.Worklist}>
              <Typography>{t('workLists:worklist')}</Typography>
            </MenuItem>
          ),
          user?.isCreator && (
            <MenuItem
              key={dataTestId.header.messagesLink}
              data-testid={dataTestId.header.messagesLink}
              onClick={closeMenu}
              component={Link}
              to={UrlPathTemplate.MyMessages}>
              <Typography>{t('workLists:messages')}</Typography>
            </MenuItem>
          ),
        ]}
        {user?.isCreator && [
          <MenuItem
            key={dataTestId.header.myRegistrationsLink}
            data-testid={dataTestId.header.myRegistrationsLink}
            onClick={closeMenu}
            component={Link}
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
            component={Link}
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
              component={Link}
              to={UrlPathTemplate.AdminInstitutions}>
              <Typography>{t('common:institutions')}</Typography>
            </MenuItem>
          ),
          isMobile && (
            <MenuItem
              key={dataTestId.header.basicDataLink}
              data-testid={dataTestId.header.basicDataLink}
              onClick={closeMenu}
              component={Link}
              to={UrlPathTemplate.BasicData}>
              <Typography>{t('basicData:basic_data')}</Typography>
            </MenuItem>
          ),
          user.isInstitutionAdmin && [
            <MenuItem
              key={dataTestId.header.adminInstitutionLink}
              data-testid={dataTestId.header.adminInstitutionLink}
              onClick={closeMenu}
              component={Link}
              to={UrlPathTemplate.MyInstitution}>
              <Typography>{t('common:my_institution')}</Typography>
            </MenuItem>,
            <MenuItem
              key={dataTestId.header.adminUsersLink}
              data-testid={dataTestId.header.adminUsersLink}
              onClick={closeMenu}
              component={Link}
              to={UrlPathTemplate.MyInstitutionUsers}>
              <Typography>{t('common:users')}</Typography>
            </MenuItem>,
          ],
          <Divider key="divider1" />,
        ]}
        <MenuItem
          data-testid={dataTestId.header.myProfileLink}
          onClick={closeMenu}
          component={Link}
          to={UrlPathTemplate.MyProfile}>
          <Typography>{t('profile:my_profile')}</Typography>
        </MenuItem>
        <MenuItem data-testid={dataTestId.header.logOutLink} onClick={handleLogout}>
          {t('authorization:logout')}
        </MenuItem>
      </MuiMenu>
    </Box>
  );
};
