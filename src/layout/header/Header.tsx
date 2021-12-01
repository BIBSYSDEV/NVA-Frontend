import { useState, MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Box, Button, Divider, IconButton, Theme, useMediaQuery } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import MailIcon from '@mui/icons-material/MailOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import AssignmentIcon from '@mui/icons-material/AssignmentOutlined';
import { RootStore } from '../../redux/reducers/rootReducer';
import { getRegistrationPath, UrlPathTemplate } from '../../utils/urlPaths';
import { Login } from './Login';
import { Logo } from './Logo';
import { GeneralMenu } from './GeneralMenu';
import { LanguageSelector } from './LanguageSelector';
import { dataTestId } from '../../utils/dataTestIds';

export const Header = () => {
  const { t } = useTranslation('registration');
  const user = useSelector((store: RootStore) => store.user);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <AppBar position="static" elevation={0} sx={{ color: 'white' }}>
      <Box
        component="nav"
        sx={{
          display: 'grid',
          justifyItems: 'center',
          gridTemplateAreas: {
            xs: '"other-menu logo user-menu"',
            md: '"other-menu logo new-result user-menu"',
          },
          gridTemplateColumns: { xs: 'auto auto auto', md: '1fr 1fr 10fr 3fr' },
          gridTemplateRows: 'auto',
          gap: '1rem',
          alignItems: 'center',
          padding: '0 1rem',
        }}>
        <IconButton
          onClick={handleClick}
          title={t('common:menu')}
          size="large"
          color="inherit"
          sx={{ gridArea: 'other-menu' }}>
          <MenuIcon fontSize="large" />
        </IconButton>
        <GeneralMenu anchorEl={anchorEl} onClose={() => setAnchorEl(null)} />

        <Logo />
        {user?.isCreator && (
          <Button
            sx={{
              gridArea: 'new-result',
              fontSize: '1.5rem',
              display: { xs: 'none', md: 'inline-flex' },
            }}
            color="inherit"
            component={RouterLink}
            data-testid="new-registration"
            to={getRegistrationPath()}
            startIcon={<AddCircleIcon />}>
            {t('new_registration')}
          </Button>
        )}
        <Box
          sx={{
            gridArea: 'user-menu',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            'a, button': {
              flexDirection: 'column',
              '.MuiButton-startIcon': {
                margin: 0,
              },
            },
          }}>
          {!isMobile && (
            <>
              <Divider
                variant="middle"
                sx={{ gridArea: 'divider', borderColor: 'white', opacity: 0.8 }}
                orientation="vertical"
                flexItem
              />
              <LanguageSelector />
              <Button
                color="inherit"
                component={RouterLink}
                data-testid={dataTestId.header.worklistLink}
                to={UrlPathTemplate.Worklist}
                startIcon={<AssignmentIcon />}>
                {t('workLists:worklist')}
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                data-testid="my-messages"
                to={UrlPathTemplate.MyMessages}
                startIcon={<MailIcon />}>
                {t('workLists:messages')}
              </Button>
            </>
          )}

          <Login />
        </Box>
      </Box>
    </AppBar>
  );
};
