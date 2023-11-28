import AccountCircle from '@mui/icons-material/AccountCircleOutlined';
import { Box, Button, IconButton, MenuItem, Menu as MuiMenu, Theme, Typography, useMediaQuery } from '@mui/material';
import { MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../../redux/store';
import { dataTestId } from '../../utils/dataTestIds';
import { UrlPathTemplate } from '../../utils/urlPaths';

interface MenuProps {
  handleLogout: () => void;
}

export const Menu = ({ handleLogout }: MenuProps) => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const customer = useSelector((store: RootState) => store.customer);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const isExtraSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const name = user?.givenName ?? '';

  const handleClickMenuAnchor = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => setAnchorEl(null);

  return (
    <Box sx={{ gridArea: 'user-items', display: 'flex' }}>
      {isSmallScreen ? (
        <IconButton onClick={handleClickMenuAnchor} title={t('common.menu')} color="inherit" size="large">
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
        {isExtraSmallScreen && user?.isCreator && (
          <MenuItem
            key={dataTestId.header.newRegistrationLink}
            data-testid={dataTestId.header.newRegistrationLink}
            onClick={closeMenu}
            component={Link}
            to={UrlPathTemplate.RegistrationNew}>
            <Typography>{t('registration.new_registration')}</Typography>
          </MenuItem>
        )}
        {isSmallScreen && [
          user?.isCreator && (
            <MenuItem
              key={dataTestId.header.myPageLink}
              data-testid={dataTestId.header.myPageLink}
              onClick={closeMenu}
              component={Link}
              to={UrlPathTemplate.MyPage}>
              <Typography>{t('my_page.my_page')}</Typography>
            </MenuItem>
          ),
          user?.isEditor && (
            <MenuItem
              key={dataTestId.header.editorLink}
              data-testid={dataTestId.header.editorLink}
              onClick={closeMenu}
              component={Link}
              to={UrlPathTemplate.EditorCurators}>
              <Typography>{customer?.shortName}</Typography>
            </MenuItem>
          ),
          user?.isCurator && (
            <MenuItem
              key={dataTestId.header.tasksLink}
              data-testid={dataTestId.header.tasksLink}
              onClick={closeMenu}
              component={Link}
              to={UrlPathTemplate.TasksDialogue}>
              <Typography>{t('common.tasks')}</Typography>
            </MenuItem>
          ),
          (user?.isAppAdmin || user?.isInstitutionAdmin) && (
            <MenuItem
              key={dataTestId.header.basicDataLink}
              data-testid={dataTestId.header.basicDataLink}
              onClick={closeMenu}
              component={Link}
              to={UrlPathTemplate.BasicData}>
              <Typography>{t('basic_data.basic_data')}</Typography>
            </MenuItem>
          ),
        ]}
        <MenuItem data-testid={dataTestId.header.logOutLink} onClick={handleLogout}>
          {t('authorization.logout')}
        </MenuItem>
      </MuiMenu>
    </Box>
  );
};
