import { useState, MouseEvent, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Box, Button, Divider, IconButton, Theme, useMediaQuery } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import MenuIcon from '@mui/icons-material/Menu';
import AssignmentIcon from '@mui/icons-material/AssignmentOutlined';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenterOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { RootState } from '../../redux/store';
import { getRegistrationPath, UrlPathTemplate } from '../../utils/urlPaths';
import { LoginButton } from './LoginButton';
import { Logo } from './Logo';
import { GeneralMenu } from './GeneralMenu';
import { LanguageSelector } from './LanguageSelector';
import { dataTestId } from '../../utils/dataTestIds';
import { useFetch } from '../../utils/hooks/useFetch';
import { CustomerInstitution } from '../../types/customerInstitution.types';
import { setPartialUser } from '../../redux/userSlice';

export const Header = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector((store: RootState) => store.user);
  const [customer] = useFetch<CustomerInstitution>({
    url: user?.isEditor && user?.customerId ? user.customerId : '',
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
              fontSize: '1.5rem',
              display: { xs: 'none', md: 'inline-flex' },
            }}
            color="inherit"
            component={RouterLink}
            data-testid={dataTestId.header.newRegistrationLink}
            to={getRegistrationPath()}
            startIcon={<AddCircleIcon />}>
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
              {user?.isEditor && customer?.shortName && (
                <Button
                  sx={{ whiteSpace: 'nowrap', borderRadius: '2rem' }}
                  color="inherit"
                  variant="outlined"
                  size="small"
                  component={RouterLink}
                  data-testid={dataTestId.header.editorLink}
                  to={UrlPathTemplate.Editor}>
                  {user.customerShortName}
                </Button>
              )}
              <Divider
                variant="middle"
                sx={{ gridArea: 'divider', borderColor: 'white', opacity: 0.8 }}
                orientation="vertical"
                flexItem
              />
              <LanguageSelector />
              {(user?.isInstitutionAdmin || user?.isAppAdmin) && (
                <Button
                  sx={{ whiteSpace: 'nowrap' }}
                  color="inherit"
                  component={RouterLink}
                  data-testid={dataTestId.header.basicDataLink}
                  to={UrlPathTemplate.BasicData}
                  startIcon={<BusinessCenterIcon />}>
                  {t('basic_data.basic_data')}
                </Button>
              )}
              {user?.isCurator && (
                <Button
                  color="inherit"
                  component={RouterLink}
                  data-testid={dataTestId.header.worklistLink}
                  to={UrlPathTemplate.Worklist}
                  startIcon={<AssignmentIcon />}>
                  {t('workLists:worklist')}
                </Button>
              )}
              {user && (
                <Button
                  sx={{ whiteSpace: 'nowrap' }}
                  color="inherit"
                  component={RouterLink}
                  data-testid={dataTestId.header.myPageLink}
                  to={UrlPathTemplate.MyPage}
                  startIcon={<FavoriteBorderIcon />}>
                  {t('my_page.my_page')}
                </Button>
              )}
            </>
          )}

          <LoginButton />
        </Box>
      </Box>
    </AppBar>
  );
};
