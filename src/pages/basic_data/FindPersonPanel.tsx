import { CircularProgress, IconButton, TextField, Typography } from '@mui/material';
import LooksOneIcon from '@mui/icons-material/LooksOne';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';
import { getValueByKey } from '../../utils/user-helpers';
import { useState, useCallback, useEffect } from 'react';
import { CristinApiPath } from '../../api/apiPaths';
import { authenticatedApiRequest } from '../../api/apiRequest';
import { CristinUser } from '../../types/user.types';
import { isSuccessStatus } from '../../utils/constants';
import { useFetch } from '../../utils/hooks/useFetch';
import { SearchResponse } from '../../types/common.types';
import { StyledCenterContainer } from '../../components/styled/Wrappers';

export const FindPersonPanel = () => {
  const { t } = useTranslation('basicData');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<CristinUser | null>();
  const [nationalNumber, setNationalNumber] = useState('');
  const cristinPersonId = getValueByKey('CristinIdentifier', user?.identifiers);
  const [currentAffiliations, isLoadingAffiliations] = useFetch<SearchResponse<any>>({
    url: cristinPersonId ? `${CristinApiPath.Person}/${cristinPersonId}/employment` : '',
    errorMessage: 'todo',
    withAuthentication: true,
  });

  const searchByNationalId = useCallback(async () => {
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
  }, [nationalNumber]);

  useEffect(() => {
    // Search when user has entered 11 chars as a Norwegian National ID is 11 chars long
    if (nationalNumber.length === 11) {
      searchByNationalId();
    }
  }, [searchByNationalId, nationalNumber]);

  return (
    <>
      <StyledCenterContainer>
        <LooksOneIcon color="primary" fontSize="large" sx={{ float: 'center' }} />
      </StyledCenterContainer>
      <TextField
        variant="filled"
        label={t('search_for_national_id')}
        value={nationalNumber}
        onChange={(event) => setNationalNumber(event.target.value)}
        fullWidth
        InputProps={{
          endAdornment: (
            <IconButton onClick={searchByNationalId} title={t('common:search')}>
              <SearchIcon />
            </IconButton>
          ),
        }}
      />
      {isLoading ? (
        <CircularProgress />
      ) : user ? (
        <>
          <TextField
            disabled
            fullWidth
            variant="filled"
            label={t('common:first_name')}
            value={getValueByKey('FirstName', user.names)}
          />
          <TextField
            disabled
            fullWidth
            variant="filled"
            label={t('common:last_name')}
            value={getValueByKey('LastName', user.names)}
          />
          <Typography variant="overline">
            {t('employments')}: {isLoadingAffiliations ? <CircularProgress /> : currentAffiliations?.size}
          </Typography>
        </>
      ) : user === null ? (
        <Typography>{t('common:no_hits')}</Typography>
      ) : null}
    </>
  );
};
