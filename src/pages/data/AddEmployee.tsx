import { TextField, CircularProgress, IconButton } from '@mui/material';
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
  const [user, setUser] = useState<CristinUser>();

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
    }
    setIsLoading(false);
  };

  return (
    <>
      <TextField
        variant="filled"
        label="Søk på fødselsnummer"
        value={nationalNumber}
        onChange={(event) => setNationalNumber(event.target.value)}
        InputProps={{
          endAdornment: (
            <IconButton type="submit" title={t('search')} size="large" onClick={searchByNationalId}>
              <SearchIcon />
            </IconButton>
          ),
        }}
      />
      {isLoading ? <CircularProgress /> : <p>{getFullCristinName(user?.names)}</p>}
    </>
  );
};
