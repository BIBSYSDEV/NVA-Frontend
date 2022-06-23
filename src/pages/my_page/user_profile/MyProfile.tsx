import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Box, Divider } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { RootState } from '../../../redux/store';
import { UserInfo } from './UserInfo';
import { UserOrcid } from './UserOrcid';
import { UserRoles } from './UserRoles';
import { UserAffiliations } from './UserAffiliations';

export const MyProfile = () => {
  const { t } = useTranslation('myPage');
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const user = useSelector((store: RootState) => store.user)!; // If user has been empty this route would already be blocked

  return (
    <>
      <Helmet>
        <title>{t('my_profile.my_profile')}</title>
      </Helmet>
      <Box
        sx={{
          display: 'grid',
          columnGap: '3rem',
          gridTemplateAreas: {
            xs: '"primary-info" "roles"',
            md: '"roles primary-info"',
          },
          gridTemplateColumns: { xs: '1fr', md: '1fr 3fr' },
        }}>
        <Box sx={{ gridArea: 'roles' }}>
          <UserRoles user={user} />
        </Box>

        <Box sx={{ display: 'grid', gridArea: 'primary-info', gap: '1rem' }}>
          <UserInfo user={user} />
          <Divider />
          <UserOrcid user={user} />
          <Divider />
          <UserAffiliations user={user} />
        </Box>
      </Box>
    </>
  );
};
