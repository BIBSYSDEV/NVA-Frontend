import LaunchIcon from '@mui/icons-material/Launch';
import { Box, Divider, Link as MuiLink, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useFetchUserQuery } from '../../../api/hooks/useFetchUserQuery';
import { BackgroundDiv } from '../../../components/styled/Wrappers';
import { RootState } from '../../../redux/store';
import { dataTestId } from '../../../utils/dataTestIds';
import { hasCuratorRole } from '../../../utils/user-helpers';
import { ViewingScopeChip } from '../../basic_data/institution_admin/edit_user/ViewingScopeChip';
import { UserRoles } from './UserRoles';

export const UserRoleAndHelp = () => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);

  const nvaUserQuery = useFetchUserQuery(user?.nvaUsername ?? '');
  const nvaUser = nvaUserQuery.data;

  return (
    <BackgroundDiv sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Helmet>
        <title>{t('my_page.my_profile.user_role_and_help.user_role_and_help')}</title>
      </Helmet>
      {nvaUser?.viewingScope && hasCuratorRole(user) && (
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
            {nvaUser.viewingScope.includedUnits.map((orgId) => (
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
        <Typography fontWeight="bold">{t('my_page.my_profile.user_role_and_help.application_help_text')}</Typography>
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
