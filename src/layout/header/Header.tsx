import { useState, MouseEvent, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { AppBar, Box, Button, Divider, IconButton, Theme, Typography, useMediaQuery } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MenuIcon from '@mui/icons-material/Menu';
import AssignmentIcon from '@mui/icons-material/AssignmentOutlined';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenterOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { RootState } from '../../redux/store';
import { UrlPathTemplate } from '../../utils/urlPaths';
import { LoginButton } from './LoginButton';
import { Logo } from './Logo';
import { GeneralMenu } from './GeneralMenu';
import { LanguageSelector } from './LanguageSelector';
import { dataTestId } from '../../utils/dataTestIds';
import { useFetch } from '../../utils/hooks/useFetch';
import { CustomerInstitution } from '../../types/customerInstitution.types';
import { setPartialUser } from '../../redux/userSlice';
import { MenuButton } from './MenuButton';

export const Header = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const currentPath = location.pathname.replace(/\/$/, '').toLowerCase(); // Remove trailing slash
  const dispatch = useDispatch();
  const user = useSelector((store: RootState) => store.user);
  const [customer] = useFetch<CustomerInstitution>({
    url: user?.customerId ?? '',
  });

  useEffect(() => {
    if (customer) {
      dispatch(setPartialUser({ customerShortName: customer.shortName }));
    }
  }, [dispatch, customer]);

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
          gridTemplateColumns: { xs: 'auto auto auto', md: '1fr 1fr 10fr 5fr' },
          gap: '1rem',
          px: '1rem',
        }}>
        <IconButton
          data-testid={dataTestId.header.generalMenuButton}
          onClick={handleClick}
          title={t('common.menu')}
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
              fontSize: '1rem',
              fontWeight: 700,
              gap: '0.5rem',
              display: { xs: 'none', md: 'inline-flex' },
              '.MuiButton-startIcon > :nth-of-type(1)': {
                fontSize: '1.875rem',
              },
            }}
            color="inherit"
            component={RouterLink}
            data-testid={dataTestId.header.newRegistrationLink}
            to={UrlPathTemplate.RegistrationNew}
            startIcon={
              <AddIcon sx={{ color: 'white', bgcolor: 'primary.light', borderRadius: '50%', padding: '0.1rem' }} />
            }>
            {t('registration.new_registration')}
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
              {customer?.shortName &&
                (user?.isEditor ? (
                  <MenuButton
                    sx={{
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      textTransform: 'none',
                    }}
                    color="inherit"
                    data-testid={dataTestId.header.editorLink}
                    to={UrlPathTemplate.Editor}
                    isSelected={currentPath.startsWith(UrlPathTemplate.Editor)}>
                    {user?.customerShortName}
                  </MenuButton>
                ) : (
                  <Typography variant="h1" component="span" sx={{ whiteSpace: 'nowrap', color: 'inherit' }}>
                    {user?.customerShortName}
                  </Typography>
                ))}
              <Divider
                variant="middle"
                sx={{ gridArea: 'divider', borderColor: 'white', opacity: 0.8 }}
                orientation="vertical"
                flexItem
              />
              <LanguageSelector />
              {(user?.isInstitutionAdmin || user?.isAppAdmin) && (
                <MenuButton
                  color="inherit"
                  isSelected={currentPath.startsWith(UrlPathTemplate.BasicData)}
                  data-testid={dataTestId.header.basicDataLink}
                  to={UrlPathTemplate.BasicData}
                  startIcon={<BusinessCenterIcon />}>
                  {t('basic_data.basic_data')}
                </MenuButton>
              )}
              {user?.isCurator && (
                <MenuButton
                  color="inherit"
                  data-testid={dataTestId.header.tasksLink}
                  isSelected={currentPath.startsWith(UrlPathTemplate.Tasks)}
                  to={UrlPathTemplate.Tasks}
                  startIcon={<AssignmentIcon />}>
                  {t('tasks.tasks')}
                </MenuButton>
              )}
              {user && (
                <MenuButton
                  color="inherit"
                  data-testid={dataTestId.header.myPageLink}
                  isSelected={currentPath.startsWith(UrlPathTemplate.MyPage)}
                  to={UrlPathTemplate.MyPage}
                  startIcon={<FavoriteBorderIcon />}>
                  {t('my_page.my_page')}
                </MenuButton>
              )}
            </>
          )}

          <LoginButton />
        </Box>
      </Box>
    </AppBar>
  );
};
