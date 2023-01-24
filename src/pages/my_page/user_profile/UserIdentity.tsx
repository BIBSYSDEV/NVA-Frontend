import { Box, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { BackgroundDiv } from '../../../components/styled/Wrappers';
import { User } from '../../../types/user.types';
import { UserRoles } from './UserRoles';
import { dataTestId } from '../../../utils/dataTestIds';
import { NationalIdNumberField } from '../../../components/NationalIdNumberField';

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
      <Typography variant="h2">{t('my_page.my_profile.identity.identity')}</Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: '4fr 3fr',
          },
          columnGap: '2rem',
          rowGap: { xs: '1rem' },
          mt: '1rem',
        }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '30rem' }}>
          <Typography>{t('my_page.my_profile.identity.not_shown_publicly')}</Typography>
          <TextField
            data-testid={dataTestId.myPage.myProfile.fullNameField}
            label={t('my_page.my_profile.identity.full_name')}
            value={fullName}
            size="small"
            variant="filled"
            disabled
          />
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: { xs: '1rem', md: '5rem' },
            }}>
            <NationalIdNumberField nationalId={nationalId} />
            <TextField
              data-testid={dataTestId.myPage.myProfile.cristinIdField}
              size="small"
              label={'Cristin ID'}
              value={userCristinId ? userCristinId : ''}
              variant="filled"
              disabled
            />
          </Box>
        </Box>

        <Box>
          <Box
            sx={{
              backgroundColor: 'background.default',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              p: '1rem',
              borderRadius: '4px',
            }}>
            <UserRoles user={user} hasActiveEmployment={hasActiveEmployment} />
          </Box>
        </Box>
      </Box>
    </BackgroundDiv>
  );
};
