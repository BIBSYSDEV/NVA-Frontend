import LaunchIcon from '@mui/icons-material/Launch';
import { Box, Divider, Link as MuiLink, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { fetchUser } from '../../../api/roleApi';
import { BackgroundDiv } from '../../../components/styled/Wrappers';
import { RootState } from '../../../redux/store';
import { dataTestId } from '../../../utils/dataTestIds';
import { ViewingScopeChip } from '../../basic_data/institution_admin/edit_user/ViewingScopeChip';
import { UserRoles } from './UserRoles';

export const UserRoleAndHelp = () => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const customer = useSelector((store: RootState) => store.customer);
  const customerServiceCenterUri = customer?.serviceCenterUri;

  const username = user?.nvaUsername ?? '';

  const nvaUserQuery = useQuery({
    enabled: !!username,
    queryKey: [username],
    queryFn: () => fetchUser(username),
    meta: { errorMessage: t('feedback.error.get_person') },
  });

  const nvaUser = nvaUserQuery.data;

  return (
    <BackgroundDiv sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {nvaUser?.viewingScope && (
        <>
          <Typography fontWeight="bold">{t('my_page.my_profile.my_area_of_responsibility')}</Typography>
          <Box sx={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {nvaUser.viewingScope?.includedUnits.map((orgId) => (
              <ViewingScopeChip key={orgId} organizationId={orgId} />
            ))}
          </Box>
          <Divider sx={{ bgcolor: 'primary.main' }} />
        </>
      )}
      {user ? (
        <Box sx={{ maxWidth: '40rem' }}>
          <UserRoles user={user} hasActiveEmployment={false} />
        </Box>
      ) : null}
      <Divider sx={{ bgcolor: 'primary.main' }} />
      <Typography fontWeight="bold" fontSize={16}>
        {t('common.help')}
      </Typography>
      <Box sx={{ display: 'flex', gap: '2rem' }}>
        {customerServiceCenterUri && (
          <>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography fontWeight="bold">Institusjonens hjelpeside</Typography>
              <MuiLink
                sx={{
                  fontWeight: 'bold',
                  color: 'primary.main',
                  display: 'flex',
                  gap: '0.5rem',
                  py: '0.5rem',
                  justifyContent: 'space-between',
                }}
                data-testid={dataTestId.myPage.userRolesAndHelp.institutionHelpPage}
                target="_blank"
                rel="noopener noreferrer"
                href={customerServiceCenterUri}>
                {customer?.displayName} {t('common.help').toLowerCase()}
                <LaunchIcon fontSize="small" />
              </MuiLink>
              <Typography fontStyle="italic">
                {t('my_page.my_profile.user_role_and_help.customer_help_text')}
              </Typography>
            </Box>
            <Divider orientation="vertical" />
          </>
        )}
        <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: '15rem' }}>
          <Typography fontWeight="bold">
            {t('my_page.my_profile.user_role_and_help.customer_help_helper_text')}
          </Typography>
          <MuiLink
            sx={{
              fontWeight: 'bold',
              color: 'primary.main',
              display: 'flex',
              gap: '0.5rem',
              py: '0.5rem',
              justifyContent: 'space-between',
            }}
            data-testid={dataTestId.myPage.userRolesAndHelp.applicationHelpPage}
            target="_blank"
            rel="noopener noreferrer"
            href={'https://sikt.no/tjenester/nasjonalt-vitenarkiv-nva/hjelpeside-nva'}>
            {t('footer.help_page')}
            <LaunchIcon fontSize="small" />
          </MuiLink>
          <Typography fontStyle="italic">
            {t('my_page.my_profile.user_role_and_help.application_help_helper_text')}
          </Typography>
        </Box>
      </Box>
    </BackgroundDiv>
  );
};
