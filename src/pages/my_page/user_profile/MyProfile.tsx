import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Box, Divider } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { RootState } from '../../../redux/store';
import { UserInfo } from './UserInfo';
import { UserOrcid } from './UserOrcid';
import { UserRoles } from './UserRoles';
import { UserAffiliations } from './UserAffiliations';
import { BackgroundDiv } from '../../../components/styled/Wrappers';
import { ResearchProfilePanel } from './ResearchProfilePanel';

export const MyProfile = () => {
  const { t } = useTranslation();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const user = useSelector((store: RootState) => store.user)!; // If user has been empty this route would already be blocked

  return (
    <>
      <Helmet>
        <title>{t('my_page.my_profile.user_profile')}</title>
      </Helmet>
      <Box sx={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '1rem' }}>
        <BackgroundDiv
          sx={{
            display: 'grid',
            columnGap: '3rem',
            gridTemplateAreas: {
              xs: '"primary-info" "roles"',
              md: '"roles primary-info"',
            },
            gridTemplateColumns: { xs: '1fr', md: '1fr 2fr' },
          }}>
          <Box sx={{ gridArea: 'roles' }}>
            <UserRoles user={user} />
          </Box>

          <Box sx={{ display: 'grid', gridArea: 'primary-info', gap: '1rem' }}>
            <UserInfo user={user} />
            <Divider />
            <UserOrcid user={user} />
          </Box>
        </BackgroundDiv>
        <ResearchProfilePanel />
      </Box>
    </>
  );
};
