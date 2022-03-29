import { CircularProgress, IconButton, TextField, Typography } from '@mui/material';
import LooksOneIcon from '@mui/icons-material/LooksOne';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';
import { Field, FieldProps, useFormikContext } from 'formik';
import { convertToFlatCristinUser } from '../../utils/user-helpers';
import { useState, useCallback, useEffect } from 'react';
import { CristinApiPath } from '../../api/apiPaths';
import { authenticatedApiRequest } from '../../api/apiRequest';
import { CristinUser } from '../../types/user.types';
import { isSuccessStatus } from '../../utils/constants';
import { useFetch } from '../../utils/hooks/useFetch';
import { SearchResponse } from '../../types/common.types';
import { StyledCenterContainer } from '../../components/styled/Wrappers';
import { AddEmployeeData, emptyUser } from './AddEmployee';

export const FindPersonPanel = () => {
  const { t } = useTranslation('basicData');
  const { values, setFieldValue } = useFormikContext<AddEmployeeData>();
  const [isLoading, setIsLoading] = useState(false);
  const [nationalNumber, setNationalNumber] = useState('');
  const [currentAffiliations, isLoadingAffiliations] = useFetch<SearchResponse<any>>({
    url: values.user.id ? `${values.user.id}/employment` : '',
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
      const foundUser = convertToFlatCristinUser(searchResponse.data);
      setFieldValue('user', foundUser);
    } else {
      setFieldValue('user', { ...emptyUser, nationalId: nationalNumber });
    }
    setIsLoading(false);
  }, [setFieldValue, nationalNumber]);

  useEffect(() => {
    // Search when user has entered 11 chars as a Norwegian National ID is 11 chars long
    if (nationalNumber.length === 11) {
      searchByNationalId();
    } else {
      setFieldValue('user', emptyUser);
    }
  }, [setFieldValue, searchByNationalId, nationalNumber]);

  return (
    <>
      <StyledCenterContainer>
        <LooksOneIcon color="primary" fontSize="large" sx={{ float: 'center' }} />
      </StyledCenterContainer>
      <TextField
        variant="filled"
        label={t('search_for_national_id')}
        value={nationalNumber}
        onChange={(event) => event.target.value.length <= 11 && setNationalNumber(event.target.value)}
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
      ) : nationalNumber.length === 11 ? (
        values.user.id ? (
          <>
            <TextField
              disabled
              fullWidth
              variant="filled"
              label={t('common:first_name')}
              value={values.user.firstName}
            />
            <TextField disabled fullWidth variant="filled" label={t('common:last_name')} value={values.user.lastName} />
            <Typography variant="overline">
              {t('employments')}: {isLoadingAffiliations ? <CircularProgress /> : currentAffiliations?.size}
            </Typography>
          </>
        ) : (
          <>
            <Typography>{t('no_matching_persons_found')}</Typography>
            <Typography variant="h3">{t('create_person')}</Typography>
            <Field name="user.firstName">
              {({ field }: FieldProps<string>) => (
                <TextField {...field} fullWidth variant="filled" label={t('common:first_name')} />
              )}
            </Field>
            <Field name="user.lastName">
              {({ field }: FieldProps<string>) => (
                <TextField {...field} fullWidth variant="filled" label={t('common:last_name')} />
              )}
            </Field>
            <TextField disabled fullWidth variant="filled" label={t('national_id')} value={nationalNumber} />
          </>
        )
      ) : null}
    </>
  );
};
