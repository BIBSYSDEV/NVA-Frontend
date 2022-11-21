import { useState, MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button, Menu as MuiMenu, MenuItem, Typography, Theme, useMediaQuery, IconButton, Box } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircleOutlined';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { UrlPathTemplate } from '../../utils/urlPaths';
import { LanguageSelector } from './LanguageSelector';
import { dataTestId } from '../../utils/dataTestIds';

interface MenuProps {
  handleLogout: () => void;
}

export const Menu = ({ handleLogout }: MenuProps) => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const name = user?.givenName ?? '';

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
          user?.isEditor && (
            <MenuItem
              key={dataTestId.header.editorLink}
              data-testid={dataTestId.header.editorLink}
              onClick={closeMenu}
              component={Link}
              to={UrlPathTemplate.Editor}>
              <Typography>{user.customerShortName}</Typography>
            </MenuItem>
          ),
          user?.isCurator && (
            <MenuItem
              key={dataTestId.header.worklistLink}
              data-testid={dataTestId.header.worklistLink}
              onClick={closeMenu}
              component={Link}
              to={UrlPathTemplate.Tasks}>
              <Typography>{t('worklist.tasks')}</Typography>
            </MenuItem>
          ),
          user?.isCreator && [
            <MenuItem
              key={dataTestId.header.newRegistrationLink}
              data-testid={dataTestId.header.newRegistrationLink}
              onClick={closeMenu}
              component={Link}
              to={UrlPathTemplate.NewRegistration}>
              <Typography>{t('registration.new_registration')}</Typography>
            </MenuItem>,
            <MenuItem
              key={dataTestId.header.myPageLink}
              data-testid={dataTestId.header.myPageLink}
              onClick={closeMenu}
              component={Link}
              to={UrlPathTemplate.MyPage}>
              <Typography>{t('my_page.my_page')}</Typography>
            </MenuItem>,
          ],
        ]}
        {(user?.isAppAdmin || user?.isInstitutionAdmin) && isMobile && (
          <MenuItem
            key={dataTestId.header.basicDataLink}
            data-testid={dataTestId.header.basicDataLink}
            onClick={closeMenu}
            component={Link}
            to={UrlPathTemplate.BasicData}>
            <Typography>{t('basic_data.basic_data')}</Typography>
          </MenuItem>
        )}
        <MenuItem data-testid={dataTestId.header.logOutLink} onClick={handleLogout}>
          {t('authorization.logout')}
        </MenuItem>
      </MuiMenu>
    </Box>
  );
};
