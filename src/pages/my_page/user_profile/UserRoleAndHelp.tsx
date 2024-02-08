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
        <div>
          <Typography gutterBottom fontWeight="bold">
            {t('editor.curators.area_of_responsibility')}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              gap: '0.5rem',
              flexWrap: 'wrap',
              mb: '0.5rem',
            }}>
            {nvaUser.viewingScope?.includedUnits.map((orgId) => (
              <ViewingScopeChip key={orgId} organizationId={orgId} />
            ))}
          </Box>
          <Divider sx={{ bgcolor: 'primary.main' }} />
        </div>
      )}
      {user && (
        <>
          <Box sx={{ maxWidth: '40rem' }}>
            <UserRoles user={user} hasActiveEmployment={false} />
          </Box>
          <Divider sx={{ bgcolor: 'primary.main' }} />
        </>
      )}
      <Typography variant="h3">{t('common.help')}</Typography>
      <div>
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
      </div>
    </BackgroundDiv>
  );
};
