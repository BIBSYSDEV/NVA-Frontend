import { useState } from 'react';
import { Box, IconButton, TextField, Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { BackgroundDiv } from '../../../components/styled/Wrappers';
import { User } from '../../../types/user.types';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getMaskedNationalIdentityNumber } from '../../../utils/user-helpers';
import { UserRoles } from './UserRoles';

interface UserIdentitiesProps {
  user: User;
}

export const UserIdentity = ({ user }: UserIdentitiesProps) => {
  const { t } = useTranslation();
  const fullName = `${user.givenName} ${user.familyName}`;
  const userCristinId = user.cristinId?.split('/').pop();
  const nationalId = user.nationalIdNumber;
  const [showFullNin, setShowFullNin] = useState(false);

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
            <TextField
              size="small"
              label={t('basic_data.person_register.national_identity_number')}
              variant="filled"
              disabled
              value={showFullNin ? nationalId : getMaskedNationalIdentityNumber(nationalId)}
              InputProps={{
                endAdornment: (
                  <Tooltip
                    title={
                      showFullNin
                        ? t('basic_data.person_register.hide_full_nin')
                        : t('basic_data.person_register.show_full_nin')
                    }>
                    <IconButton onClick={() => setShowFullNin(!showFullNin)}>
                      {showFullNin ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                  </Tooltip>
                ),
              }}
            />
            <TextField
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
            <UserRoles user={user} />
          </Box>
        </Box>
      </Box>
    </BackgroundDiv>
  );
};
