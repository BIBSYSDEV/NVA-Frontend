import {
  TextField,
  CircularProgress,
  IconButton,
  Typography,
  Box,
  Divider,
  styled,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
} from '@mui/material';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import LooksOneIcon from '@mui/icons-material/LooksOne';
import LooksTwoIcon from '@mui/icons-material/LooksTwo';
import LooksThreeIcon from '@mui/icons-material/Looks3';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';
import { authenticatedApiRequest } from '../../api/apiRequest';
import { CristinUser, RoleName } from '../../types/user.types';
import { isSuccessStatus } from '../../utils/constants';
import { getValueByKey } from '../../utils/user-helpers';
import { CristinApiPath } from '../../api/apiPaths';
import { useFetch } from '../../utils/hooks/useFetch';
import { SearchResponse } from '../../types/common.types';

const StyledCenterContainer = styled(Box)({
  width: '100%',
  display: 'flex',
  justifyContent: 'space-around',
});

export const AddEmployee = () => {
  const { t } = useTranslation('basicData');
  const [nationalNumber, setNationalNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<CristinUser | null>();

  const cristinPersonId = getValueByKey('CristinIdentifier', user?.identifiers);
  const [currentAffiliations, isLoadingAffiliations] = useFetch<SearchResponse<any>>({
    url: cristinPersonId ? `${CristinApiPath.Person}/${cristinPersonId}/employment` : '',
    errorMessage: 'todo',
    withAuthentication: true,
  });

  const [selectedRoles, setSelectedRoles] = useState<RoleName[]>([]);
  const onChangeRoles = (event: ChangeEvent<HTMLInputElement>) => {
    const roleName = event.target.value as RoleName;
    if (selectedRoles.includes(roleName)) {
      setSelectedRoles((state) => state.filter((role) => role !== roleName));
    } else {
      setSelectedRoles((state) => [...state, roleName]);
    }
  };

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
        </Box>
        <Divider orientation="vertical" />
        <Box>
          <StyledCenterContainer>
            <LooksTwoIcon color="primary" fontSize="large" />
          </StyledCenterContainer>
        </Box>
        <Divider orientation="vertical" />
        <Box>
          <StyledCenterContainer>
            <LooksThreeIcon color="primary" fontSize="large" />
          </StyledCenterContainer>
          <FormControl component="fieldset">
            <FormLabel component="legend">{t('profile:heading.roles')}</FormLabel>
            <FormGroup sx={{ gap: '0.5rem' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedRoles.includes(RoleName.CURATOR)}
                    onChange={onChangeRoles}
                    value={RoleName.CURATOR}
                  />
                }
                label={
                  <>
                    <Typography variant="overline" sx={{ fontSize: '0.9rem' }}>
                      {t('profile:roles.curator')}
                    </Typography>
                    <Typography>{t('profile:roles.curator_description')}</Typography>
                  </>
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedRoles.includes(RoleName.CREATOR)}
                    onChange={onChangeRoles}
                    value={RoleName.CREATOR}
                  />
                }
                label={
                  <>
                    <Typography variant="overline" sx={{ fontSize: '0.9rem' }}>
                      {t('profile:roles.creator')}
                    </Typography>
                    <Typography>{t('profile:roles.creator_description')}</Typography>
                  </>
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedRoles.includes(RoleName.EDITOR)}
                    onChange={onChangeRoles}
                    value={RoleName.EDITOR}
                  />
                }
                label={
                  <>
                    <Typography variant="overline" sx={{ fontSize: '0.9rem' }}>
                      {t('profile:roles.editor')}
                    </Typography>
                    <Typography>{t('profile:roles.editor_description')}</Typography>
                  </>
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedRoles.includes(RoleName.INSTITUTION_ADMIN)}
                    onChange={onChangeRoles}
                    value={RoleName.INSTITUTION_ADMIN}
                  />
                }
                label={
                  <>
                    <Typography variant="overline" sx={{ fontSize: '0.9rem' }}>
                      {t('profile:roles.institution_admin')}
                    </Typography>
                    <Typography>{t('profile:roles.institution_admin_description')}</Typography>
                  </>
                }
              />
            </FormGroup>
          </FormControl>
        </Box>
      </Box>
      <StyledCenterContainer>
        <Button variant="contained" size="large" disabled>
          {t('common:create')}
        </Button>
      </StyledCenterContainer>
    </>
  );
};
