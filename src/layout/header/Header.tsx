import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { AppBar, Box, Button, Divider, Theme, Typography, useMediaQuery } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import AssignmentIcon from '@mui/icons-material/AssignmentOutlined';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenterOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { RootState } from '../../redux/store';
import { UrlPathTemplate } from '../../utils/urlPaths';
import { LoginButton } from './LoginButton';
import { Logo } from './Logo';
import { LanguageSelector } from './LanguageSelector';
import { dataTestId } from '../../utils/dataTestIds';
import { useFetch } from '../../utils/hooks/useFetch';
import { CustomerInstitution } from '../../types/customerInstitution.types';
import { MenuButton, MenuIconButton } from './MenuButton';
import { setCustomer } from '../../redux/customerReducer';

export const Header = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const currentPath = location.pathname.replace(/\/$/, '').toLowerCase(); // Remove trailing slash
  const dispatch = useDispatch();
  const user = useSelector((store: RootState) => store.user);
  const [customer] = useFetch<CustomerInstitution>({
    url: user?.customerId ?? '',
    errorMessage: t('feedback.error.get_customer'),
    withAuthentication: true,
  });

  useEffect(() => {
    if (customer) {
      dispatch(setCustomer(customer));
    }
  }, [dispatch, customer]);

  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const isLargeScreen = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));

  return (
    <AppBar position="static" elevation={0} sx={{ color: 'white' }}>
      <Box
        component="nav"
        sx={{
          display: 'grid',
          justifyItems: 'center',
          gridTemplateAreas: {
            xs: '"language logo user-menu"',
            lg: '"language logo search new-result user-menu"',
          },
          gridTemplateColumns: { xs: 'auto auto auto', lg: '3fr auto 1fr 10fr 5fr' },
          gap: '1rem',
          px: '1rem',
        }}>
        <LanguageSelector isMobile={isMobile} />

        <Logo />

        {isLargeScreen && (
          <MenuIconButton
            color="inherit"
            sx={{ gridArea: 'search' }}
            title={t('common.search')}
            isSelected={location.pathname === UrlPathTemplate.Home || currentPath === UrlPathTemplate.Home}
            to={UrlPathTemplate.Home}>
            <SearchIcon fontSize="large" />
          </MenuIconButton>
        )}

        {user?.isCreator && (
          <Button
            sx={{
              gridArea: 'new-result',
              fontSize: '1rem',
              fontWeight: 700,
              gap: '0.5rem',
              display: { xs: 'none', lg: 'inline-flex' },
              '.MuiButton-startIcon > :nth-of-type(1)': {
                fontSize: '1.875rem',
              },
            }}
            color="inherit"
            component={RouterLink}
            data-testid={dataTestId.header.newRegistrationLink}
            to={UrlPathTemplate.RegistrationNew}
            startIcon={
              <AddIcon
                sx={{
                  color: 'white',
                  bgcolor: 'primary.light',
                  borderRadius: '50%',
                  padding: '0.2rem',
                  width: '3.125rem',
                  height: '3.125rem',
                }}
              />
            }>
            {t('registration.new_registration')}
          </Button>
        )}
        <Box
          sx={{
            gridArea: 'user-menu',
            display: 'flex',
            alignItems: 'stretch',
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
                    isSelected={currentPath.startsWith(UrlPathTemplate.Editor)}
                    color="inherit"
                    data-testid={dataTestId.header.editorLink}
                    to={UrlPathTemplate.EditorCurators}>
                    {customer.shortName}
                  </MenuButton>
                ) : (
                  <Typography
                    variant="h1"
                    component="span"
                    sx={{ whiteSpace: 'nowrap', color: 'inherit', alignSelf: 'center' }}>
                    {customer.shortName}
                  </Typography>
                ))}
              <Divider
                variant="middle"
                sx={{ gridArea: 'divider', borderColor: 'white', opacity: 0.8 }}
                orientation="vertical"
                flexItem
              />
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
                  {t('common.tasks')}
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
