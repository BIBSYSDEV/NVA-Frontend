import { Autocomplete, Box, Button, CircularProgress, IconButton, TextField, Typography } from '@mui/material';
import LooksOneIcon from '@mui/icons-material/LooksOne';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';
import { ErrorMessage, Field, FieldProps, useFormikContext } from 'formik';
import { useState, useCallback, useEffect } from 'react';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
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
  const { searchQuery } = values;
  const debouncedSearchQuery = useDebounce(searchQuery);

  const searchQueryIsNumber = searchQuery && !isNaN(Number(searchQuery));
  const searchQueryIsNin = searchQueryIsNumber && searchQuery.length === 11;

  const [searchByNameResponse, isLoadingSearchByName] = useFetch<SearchResponse<CristinPerson>>({
    url: debouncedSearchQuery && !searchQueryIsNumber ? `${CristinApiPath.Person}?name=${debouncedSearchQuery}` : '',
    withAuthentication: true,
  });
  const searchByNameOptions = searchByNameResponse?.hits
    ? searchByNameResponse.hits.map((person) => convertToFlatCristinPerson(person))
    : [];

  const searchByNationalId = useCallback(async () => {
    setIsLoading(true);
    const searchResponse = await searchByNationalIdNumber(searchQuery);
    if (isSuccessStatus(searchResponse.status)) {
      const foundUser = convertToFlatCristinPerson(searchResponse.data);
      setFieldValue('user', foundUser);
    } else {
      setFieldValue('user', { ...emptyUser, nationalId: searchQuery });
    }
    setIsLoading(false);
  }, [setFieldValue, searchQuery]);

  useEffect(() => {
    // Search when user has entered 11 chars as a Norwegian National ID is 11 chars long
    if (searchQueryIsNin) {
      searchByNationalId();
    } else {
      setFieldValue('user', emptyUser);
    }
  }, [setFieldValue, searchByNationalId, searchQueryIsNin]);

  return (
    <>
      <StyledCenterContainer>
        <LooksOneIcon color="primary" fontSize="large" sx={{ float: 'center' }} />
      </StyledCenterContainer>

      {!values.user.id && (
        <Field name="searchQuery">
          {({ field }: FieldProps<string>) => (
            <Autocomplete
              disabled={isSubmitting}
              options={searchByNameOptions}
              getOptionLabel={() => searchQuery}
              onChange={(_, value) => {
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
                  label={t('add_employee.search_for_person')}
                  showSearchIcon
                  isLoading={isLoadingSearchByName}
                  placeholder={t('add_employee.name_or_nin')}
                />
              )}
            />
          )}
        </Field>
      )}

      {isLoading ? (
        <CircularProgress />
      ) : values.user.id ? (
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
            <Typography variant="overline">{t('common:employments')}</Typography>
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
          <Button
            variant="outlined"
            color="error"
            onClick={() => setFieldValue('user', emptyUser)}
            sx={{ width: 'fit-content' }}
            startIcon={<HighlightOffIcon />}>
            {t('add_employee.remove_selected_person')}
          </Button>
        </>
      ) : (
        <>
          {/* <Typography>{t('add_employee.no_matching_persons_found')}</Typography>
          <Typography variant="h3">{t('add_employee.create_person')}</Typography>
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
          <TextField disabled required fullWidth variant="filled" label={t('national_id')} value={searchIdNumber} /> */}
        </>
      )}
    </>
  );
};
