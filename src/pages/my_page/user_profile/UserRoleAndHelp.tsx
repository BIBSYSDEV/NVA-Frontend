import { Box, Divider, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { fetchUser } from '../../../api/roleApi';
import { BackgroundDiv } from '../../../components/styled/Wrappers';
import { RootState } from '../../../redux/store';
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
        <Box sx={{ width: '50%' }}>
          <UserRoles user={user} hasActiveEmployment={false} />
        </Box>
      ) : null}
      <Divider sx={{ bgcolor: 'primary.main' }} />
      <Typography fontWeight="bold">{t('common.help')}</Typography>
    </BackgroundDiv>
  );
};
