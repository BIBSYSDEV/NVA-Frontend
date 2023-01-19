import { Box, IconButton, TextField, Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { BackgroundDiv } from '../../../components/styled/Wrappers';
import { User } from '../../../types/user.types';
import { getMaskedNationalIdentityNumber } from '../../../utils/user-helpers';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useState } from 'react';

interface UserIdentitiesProps {
  user: User;
}
export const UserIdentities = ({ user }: UserIdentitiesProps) => {
  const { t } = useTranslation();
  const fullName = `${user.givenName} ${user.familyName}`;
  const nationalId = user.nationalIdNumber;
  const [showFullNin, setShowFullNin] = useState(false);

  return (
    <BackgroundDiv sx={{ bgcolor: 'secondary.dark' }}>
      <Typography variant="h2">Identities</Typography>
      <Typography>Vises ikke offentlig</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: '3fr 2fr' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
          <Box>
            <Typography>Fullt navn</Typography>
            <Typography>{t('basic_data.person_register.national_identity_number')}</Typography>
          </Box>
          <Box>
            <TextField value={fullName} size="small" variant="filled" hiddenLabel disabled />

            <TextField
              size="small"
              variant="filled"
              disabled
              value={showFullNin ? nationalId : getMaskedNationalIdentityNumber(nationalId)}
              hiddenLabel
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
          </Box>
          <Box sx={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <Typography>ID</Typography>
            <Typography>12345</Typography>
          </Box>
        </Box>

        <Box>
          <Box>
            <Box sx={{ backgroundColor: 'white' }}>
              <Typography fontWeight={600}>Brukerroller</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </BackgroundDiv>
  );
};
