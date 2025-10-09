import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Box, Divider, Link as MuiLink, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useFetchInstitutionUser } from '../../../api/hooks/useFetchInstitutionUser';
import { HeadTitle } from '../../../components/HeadTitle';
import { RootState } from '../../../redux/store';
import { dataTestId } from '../../../utils/dataTestIds';
import { hasCuratorRole } from '../../../utils/user-helpers';
import { ViewingScopeChip } from '../../basic_data/institution_admin/edit_user/ViewingScopeChip';
import { UserRoles } from './UserRoles';

export const UserRoleAndHelp = () => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);

  const nvaUserQuery = useFetchInstitutionUser(user?.nvaUsername ?? '');
  const nvaUser = nvaUserQuery.data;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <HeadTitle>{t('my_page.my_profile.user_role_and_help.user_role_and_help')}</HeadTitle>
      <Typography variant="h1">{t('my_page.my_profile.user_role_and_help.user_role_and_help')}</Typography>
      {nvaUser?.viewingScope && hasCuratorRole(user) && (
        <div>
          <Typography gutterBottom variant="h2">
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
      <Typography variant="h2">{t('common.help')}</Typography>
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
          <OpenInNewIcon fontSize="small" />
        </MuiLink>
        <Typography fontStyle="italic">
          {t('my_page.my_profile.user_role_and_help.application_help_helper_text')}
        </Typography>
      </div>
    </Box>
  );
};
