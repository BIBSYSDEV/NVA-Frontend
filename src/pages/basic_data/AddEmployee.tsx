import { TextField, CircularProgress, IconButton, Typography, Box, Divider, styled } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import LooksOneIcon from '@mui/icons-material/LooksOne';
import LooksTwoIcon from '@mui/icons-material/LooksTwo';
import LooksThreeIcon from '@mui/icons-material/Looks3';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';
import { authenticatedApiRequest } from '../../api/apiRequest';
import { CristinUser } from '../../types/user.types';
import { isSuccessStatus } from '../../utils/constants';
import { getValueByKey } from '../../utils/user-helpers';
import { CristinApiPath } from '../../api/apiPaths';

const StyledIconContainer = styled(Box)({
  width: '100%',
  display: 'flex',
  justifyContent: 'space-around',
});

export const AddEmployee = () => {
  const { t } = useTranslation('basicData');
  const [nationalNumber, setNationalNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<CristinUser | null>();

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
      <Typography variant="h3" component="h2" paragraph>
        {t('add_to_your_person_registry')}
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr auto 1fr', gap: '2rem', mt: '2rem' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', gap: '1rem' }}>
          <StyledIconContainer>
            <LooksOneIcon color="primary" fontSize="large" sx={{ float: 'center' }} />
          </StyledIconContainer>
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
            </>
          ) : user === null ? (
            <Typography>{t('common:no_hits')}</Typography>
          ) : null}
        </Box>
        <Divider orientation="vertical" />
        <Box>
          <StyledIconContainer>
            <LooksTwoIcon color="primary" fontSize="large" />
          </StyledIconContainer>
        </Box>
        <Divider orientation="vertical" />
        <Box>
          <StyledIconContainer>
            <LooksThreeIcon color="primary" fontSize="large" />
          </StyledIconContainer>
        </Box>
      </Box>
    </>
  );
};
