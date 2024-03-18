import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AddIcon from '@mui/icons-material/Add';
import AssignmentIcon from '@mui/icons-material/AssignmentOutlined';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenterOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SearchIcon from '@mui/icons-material/Search';
import { AppBar, Badge, Box, Theme, Typography, useMediaQuery } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getById } from '../../api/commonApi';
import { fetchCustomerTickets } from '../../api/searchApi';
import { notificationsParams } from '../../pages/messages/TasksPage';
import { setCustomer } from '../../redux/customerReducer';
import { RootState } from '../../redux/store';
import { CustomerInstitution } from '../../types/customerInstitution.types';
import { Organization } from '../../types/organization.types';
import { dataTestId } from '../../utils/dataTestIds';
import { useFetch } from '../../utils/hooks/useFetch';
import { UrlPathTemplate } from '../../utils/urlPaths';
import { hasCuratorRole } from '../../utils/user-helpers';
import { LoginButton } from './LoginButton';
import { Logo } from './Logo';
import { MenuButton, MenuIconButton } from './MenuButton';

export const Header = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const currentPath = location.pathname.replace(/\/$/, '').toLowerCase(); // Remove trailing slash
  const dispatch = useDispatch();
  const user = useSelector((store: RootState) => store.user);
  const institutionId = user?.topOrgCristinId ?? '';

  const organizationQuery = useQuery({
    enabled: !!institutionId,
    queryKey: [institutionId],
    queryFn: () => getById<Organization>(institutionId),
    staleTime: Infinity,
    cacheTime: 1_800_000, // 30 minutes
    meta: { errorMessage: t('feedback.error.get_institution') },
  });
  const organization = organizationQuery.data;

  const [customer] = useFetch<CustomerInstitution>({
    url: user?.customerId ?? '',
    errorMessage: t('feedback.error.get_customer'),
    withAuthentication: true,
  });

  useEffect(() => {
    if (customer) {
      // This is needed to ensure user has correct publish workflow etc from Customer.
      // TODO: Should be moved away from redux at one point.
      dispatch(setCustomer(customer));
    }
  }, [dispatch, customer]);

  const isTicketCurator = hasCuratorRole(user);

  const notificationsQuery = useQuery({
    enabled: isTicketCurator,
    queryKey: ['notifications', notificationsParams],
    queryFn: () => fetchCustomerTickets(notificationsParams),
    meta: { errorMessage: false },
  });

  const pendingTasksCount =
    notificationsQuery.data?.aggregations?.byUserPending
      ?.map((notification) => notification.count)
      .reduce((a, b) => a + b, 0) ?? 0;

  const unassignedTasksCount =
    notificationsQuery.data?.aggregations?.status?.find((notification) => notification.key === 'New')?.count ?? 0;

  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  return (
    <AppBar position="sticky" elevation={0} sx={{ color: 'white' }}>
      <Box
        component="nav"
        sx={{
          display: 'grid',
          justifyItems: 'center',
          gridTemplateAreas: '"logo search new-result user-menu"',
          gridTemplateColumns: { xs: 'auto auto 1fr auto', md: 'auto 1fr 10fr auto' },
          gap: { xs: '0.5rem', sm: '1rem' },
          px: '1rem',
        }}>
        <Logo />
        <MenuIconButton
          color="inherit"
          sx={{ gridArea: 'search' }}
          title={t('common.search')}
          isSelected={location.pathname === UrlPathTemplate.Home || currentPath === UrlPathTemplate.Home}
          to={UrlPathTemplate.Home}>
          <SearchIcon fontSize="large" />
        </MenuIconButton>

        {user?.isCreator && (
          <MenuButton
            sx={{
              gridArea: 'new-result',
              fontSize: '1.4rem',
              fontWeight: 700,
              gap: '0.5rem',
              display: { xs: 'none', sm: 'inline-flex' },
            }}
            isSelected={currentPath === UrlPathTemplate.RegistrationNew}
            color="inherit"
            data-testid={dataTestId.header.newRegistrationLink}
            to={UrlPathTemplate.RegistrationNew}
            startIcon={
              <AddIcon
                sx={{
                  color: 'white',
                  bgcolor: 'primary.light',
                  borderRadius: '50%',
                  padding: '0.2rem',
                  width: '2.25rem',
                  height: '2.25rem',
                }}
              />
            }>
            {t('registration.new_registration')}
          </MenuButton>
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
              {organization?.acronym &&
                (user?.isEditor ? (
                  <MenuButton
                    startIcon={<AccountBalanceIcon />}
                    isSelected={currentPath.startsWith(UrlPathTemplate.Editor)}
                    color="inherit"
                    data-testid={dataTestId.header.editorLink}
                    to={UrlPathTemplate.EditorInstitution}>
                    {organization.acronym}
                  </MenuButton>
                ) : (
                  <Typography
                    variant="h1"
                    component="span"
                    sx={{ whiteSpace: 'nowrap', color: 'inherit', alignSelf: 'center' }}>
                    {organization.acronym}
                  </Typography>
                ))}

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
              {(isTicketCurator || user?.isNviCurator) && (
                <Badge
                  badgeContent={pendingTasksCount + unassignedTasksCount}
                  color="info"
                  sx={{
                    '& .MuiBadge-badge': {
                      right: 20,
                      top: 20,
                    },
                  }}>
                  <MenuButton
                    color="inherit"
                    data-testid={dataTestId.header.tasksLink}
                    isSelected={currentPath.startsWith(UrlPathTemplate.Tasks)}
                    to={UrlPathTemplate.Tasks}
                    startIcon={<AssignmentIcon />}>
                    {t('common.tasks')}
                  </MenuButton>
                </Badge>
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
