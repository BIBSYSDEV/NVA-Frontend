import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { PageHeader } from '../../components/PageHeader';
import { SyledPageContent, StyledRightAlignedWrapper } from '../../components/styled/Wrappers';
import { RootState } from '../../redux/store';
import { getUserPath } from '../../utils/urlPaths';
import { UserInfo } from './UserInfo';
import { UserOrcid } from './UserOrcid';
import { UserRoles } from './UserRoles';
import { UserAffiliations } from './UserAffiliations';

const MyProfilePage = () => {
  const { t } = useTranslation('profile');
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const user = useSelector((store: RootState) => store.user)!; // If user has been empty this route would already be blocked

  return (
    <SyledPageContent>
      <PageHeader>{t('my_profile')}</PageHeader>
      <Box
        sx={{
          display: 'grid',
          gap: '2rem',
          fontSize: '1rem',
          gridTemplateAreas: {
            xs: '"top" "primary-info" "roles"',
            md: '"top top" "roles primary-info" ". primary-info"',
          },
          gridTemplateColumns: { xs: '1fr', md: '1fr 3fr' },
        }}>
        {user.cristinId && (
          <StyledRightAlignedWrapper sx={{ gridArea: 'top' }}>
            <Button component={RouterLink} to={getUserPath(user.cristinId)} data-testid="public-profile-button">
              {t('workLists:go_to_public_profile')}
            </Button>
          </StyledRightAlignedWrapper>
        )}
        <Box sx={{ gridArea: 'roles' }}>
          <UserRoles user={user} />
        </Box>

        <Box sx={{ display: 'grid', gridArea: 'primary-info', gap: '1rem' }}>
          <UserInfo user={user} />
          <UserOrcid user={user} />
          <UserAffiliations user={user} />
        </Box>
      </Box>
    </SyledPageContent>
  );
};

export default MyProfilePage;
