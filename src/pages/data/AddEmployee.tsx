import { TextField, CircularProgress, IconButton, Typography, Box } from '@mui/material';
import { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';
import { authenticatedApiRequest } from '../../api/apiRequest';
import { CristinUser } from '../../types/user.types';
import { isSuccessStatus } from '../../utils/constants';
import { getFullCristinName } from '../../utils/user-helpers';
import { CristinApiPath } from '../../api/apiPaths';

export const AddEmployee = () => {
  const { t } = useTranslation();
  const [nationalNumber, setNationalNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<CristinUser | null>();

  const searchByNationalId = async () => {
    setIsLoading(true);
    const searchResponse = await authenticatedApiRequest<CristinUser>({
      url: CristinApiPath.PersonIdentityNumer,
      method: 'POST',
      data: {
        type: 'NationalIdentificationNumber',
        value: nationalNumber,
      },
    });
    if (isSuccessStatus(searchResponse.status)) {
      setUser(searchResponse.data);
    } else {
      setUser(null);
    }
    setIsLoading(false);
  };

  return (
    <>
      <Typography variant="h3" component="h2" paragraph>
        Legg til i ditt personregister
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', gap: '1rem' }}>
        <TextField
          variant="filled"
          label="Søk på fødselsnummer"
          value={nationalNumber}
          onChange={(event) => setNationalNumber(event.target.value)}
          InputProps={{
            endAdornment: (
              <IconButton onClick={searchByNationalId} title={t('search')} size="large">
                <SearchIcon />
              </IconButton>
            ),
          }}
        />
        {isLoading ? (
          <CircularProgress />
        ) : user ? (
          <p>{getFullCristinName(user.names)}</p>
        ) : user === null ? (
          <p>ingen treff</p>
        ) : null}
      </Box>
    </>
  );
};
