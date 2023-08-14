import { Box, Divider, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { NationalIdNumberField } from '../../../components/NationalIdNumberField';
import { BackgroundDiv } from '../../../components/styled/Wrappers';
import { User } from '../../../types/user.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { UserOrcid } from './UserOrcid';
import { UserRoles } from './UserRoles';

interface UserIdentitiesProps {
  user: User;
  hasActiveEmployment: boolean;
}

export const UserIdentity = ({ user, hasActiveEmployment }: UserIdentitiesProps) => {
  const { t } = useTranslation();
  const fullName = `${user.givenName} ${user.familyName}`;
  const userCristinId = user.cristinId?.split('/').pop();
  const nationalId = user.nationalIdNumber;

  return (
    <BackgroundDiv sx={{ bgcolor: 'secondary.main' }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            lg: '4fr auto 3fr',
          },
          columnGap: '2rem',
          rowGap: { xs: '1rem' },
          mt: '1rem',
        }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '30rem' }}>
          <Typography variant="h2">{t('my_page.my_profile.identity.identity')}</Typography>
          <Typography>{t('my_page.my_profile.identity.not_shown_publicly')}</Typography>
          <TextField
            data-testid={dataTestId.myPage.myProfile.fullNameField}
            label={t('my_page.my_profile.identity.full_name')}
            value={fullName}
            variant="filled"
            disabled
          />
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: '0.5rem',
              justifyContent: 'space-between',
            }}>
            <NationalIdNumberField nationalId={nationalId} />
            <TextField
              data-testid={dataTestId.myPage.myProfile.cristinIdField}
              label={t('my_page.my_profile.identity.cristin_id')}
              value={userCristinId ? userCristinId : ''}
              variant="filled"
              disabled
            />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
            <Typography fontWeight={600}>{t('common.orcid')}</Typography>
            <UserOrcid user={user} />
          </Box>
        </Box>
        <Divider orientation="vertical" />
        <Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}>
            <UserRoles user={user} hasActiveEmployment={hasActiveEmployment} />
          </Box>
        </Box>
      </Box>
    </BackgroundDiv>
  );
};
