import { Autocomplete, Box, CircularProgress, IconButton, TextField, Typography } from '@mui/material';
import LooksOneIcon from '@mui/icons-material/LooksOne';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';
import { ErrorMessage, Field, FieldProps, useFormikContext } from 'formik';
import { useState, useCallback, useEffect } from 'react';
import { convertToFlatCristinPerson } from '../../../utils/user-helpers';
import { isSuccessStatus } from '../../../utils/constants';
import { StyledCenterContainer } from '../../../components/styled/Wrappers';
import { AddEmployeeData, emptyUser } from './AddEmployeePage';
import { AffiliationHierarchy } from '../../../components/institution/AffiliationHierarchy';
import { getLanguageString } from '../../../utils/translation-helpers';
import { searchByNationalIdNumber } from '../../../api/userApi';
import { useDebounce } from '../../../utils/hooks/useDebounce';
import { useFetch } from '../../../utils/hooks/useFetch';
import { CristinApiPath } from '../../../api/apiPaths';
import { SearchResponse } from '../../../types/common.types';
import { CristinPerson } from '../../../types/user.types';
import { AutocompleteTextField } from '../../../components/AutocompleteTextField';
import { EmphasizeSubstring } from '../../../components/EmphasizeSubstring';

export const FindPersonPanel = () => {
  const { t } = useTranslation('basicData');
  const { values, setFieldValue, isSubmitting } = useFormikContext<AddEmployeeData>();
  const [isLoading, setIsLoading] = useState(false);
  const { searchIdNumber, searchQuery } = values;
  const debouncedSearchQuery = useDebounce(searchQuery);

  const [searchByNameResponse, isLoadingSearchByName] = useFetch<SearchResponse<CristinPerson>>({
    url: debouncedSearchQuery ? `${CristinApiPath.Person}?name=${debouncedSearchQuery}` : '',
  });
  const searchByNameOptions = searchByNameResponse?.hits
    ? searchByNameResponse.hits.map((person) => convertToFlatCristinPerson(person))
    : [];

  const searchByNationalId = useCallback(async () => {
    setIsLoading(true);
    const searchResponse = await searchByNationalIdNumber(searchIdNumber);
    if (isSuccessStatus(searchResponse.status)) {
      const foundUser = convertToFlatCristinPerson(searchResponse.data);
      setFieldValue('user', foundUser);
    } else {
      setFieldValue('user', { ...emptyUser, nationalId: searchIdNumber });
    }
    setIsLoading(false);
  }, [setFieldValue, searchIdNumber]);

  useEffect(() => {
    // Search when user has entered 11 chars as a Norwegian National ID is 11 chars long
    if (searchIdNumber.length === 11) {
      searchByNationalId();
    } else {
      setFieldValue('user', emptyUser);
    }
  }, [setFieldValue, searchByNationalId, searchIdNumber]);

  return (
    <>
      <StyledCenterContainer>
        <LooksOneIcon color="primary" fontSize="large" sx={{ float: 'center' }} />
      </StyledCenterContainer>
      <Field name="searchIdNumber">
        {({ field }: FieldProps<string>) => (
          <TextField
            {...field}
            disabled={isSubmitting}
            variant="filled"
            label={t('search_for_national_id')}
            onChange={(event) => event.target.value.length <= 11 && field.onChange(event)}
            fullWidth
            InputProps={{
              endAdornment: (
                <IconButton onClick={searchByNationalId} title={t('common:search')}>
                  <SearchIcon />
                </IconButton>
              ),
            }}
          />
        )}
      </Field>
      <Field name="searchQuery">
        {({ field }: FieldProps<string>) => (
          <Autocomplete
            options={searchByNameOptions}
            getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
            onChange={(event, value) => {
              console.log(value);
              if (value) {
                setFieldValue('user', value);
              } else {
                setFieldValue('user', emptyUser);
              }
            }}
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }} data-testid={`project-option-${option.id}`}>
                  <Typography variant="subtitle1">
                    <EmphasizeSubstring text={`${option.firstName} ${option.lastName}`} emphasized={searchQuery} />
                  </Typography>
                  {option.affiliations.map((affiliation, index) => {
                    const roleName = getLanguageString(affiliation.role.labels);
                    return (
                      <Box key={`${affiliation.organization}-${index}`} sx={{ display: 'flex', gap: '0.25rem' }}>
                        {roleName && <Typography>{roleName}:</Typography>}
                        <AffiliationHierarchy
                          key={affiliation.organization}
                          unitUri={affiliation.organization}
                          commaSeparated
                        />
                      </Box>
                    );
                  })}
                </Box>
              </li>
            )}
            renderInput={(params) => (
              <AutocompleteTextField
                {...params}
                {...field}
                label={t('search_with_name')}
                isLoading={isLoadingSearchByName}
                placeholder={t('search_with_name')}
              />
            )}
          />
        )}
      </Field>
      {isLoading ? (
        <CircularProgress />
      ) : searchIdNumber.length === 11 || searchQuery ? (
        values.user.id ? (
          <>
            <TextField
              disabled
              required
              fullWidth
              variant="filled"
              label={t('common:first_name')}
              value={values.user.firstName}
            />
            <TextField
              disabled
              required
              fullWidth
              variant="filled"
              label={t('common:last_name')}
              value={values.user.lastName}
            />
            <div>
              <Typography variant="overline">{t('employments')}</Typography>
              <Box component="ul" sx={{ my: 0, pl: '1rem' }}>
                {values.user.affiliations.map((affiliation) => {
                  const roleString = getLanguageString(affiliation.role.labels);
                  return (
                    <li key={affiliation.organization}>
                      <Box sx={{ display: 'flex', gap: '0.5rem' }}>
                        {roleString && <Typography>{roleString}:</Typography>}
                        <AffiliationHierarchy unitUri={affiliation.organization} commaSeparated />
                      </Box>
                    </li>
                  );
                })}
              </Box>
            </div>
          </>
        ) : (
          <>
            <Typography>{t('no_matching_persons_found')}</Typography>
            <Typography variant="h3">{t('create_person')}</Typography>
            <Field name="user.firstName">
              {({ field, meta: { touched, error } }: FieldProps<string>) => (
                <TextField
                  {...field}
                  disabled={isSubmitting}
                  required
                  fullWidth
                  variant="filled"
                  label={t('common:first_name')}
                  error={touched && !!error}
                  helperText={<ErrorMessage name={field.name} />}
                />
              )}
            </Field>
            <Field name="user.lastName">
              {({ field, meta: { touched, error } }: FieldProps<string>) => (
                <TextField
                  {...field}
                  disabled={isSubmitting}
                  required
                  fullWidth
                  variant="filled"
                  label={t('common:last_name')}
                  error={touched && !!error}
                  helperText={<ErrorMessage name={field.name} />}
                />
              )}
            </Field>
            <TextField disabled required fullWidth variant="filled" label={t('national_id')} value={searchIdNumber} />
          </>
        )
      ) : null}
    </>
  );
};
