import { CircularProgress, IconButton, TextField, Typography } from '@mui/material';
import LooksOneIcon from '@mui/icons-material/LooksOne';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';
import { ErrorMessage, Field, FieldProps, useFormikContext } from 'formik';
import { useState, useCallback, useEffect } from 'react';
import { Box } from '@mui/system';
import { convertToFlatCristinUser } from '../../../utils/user-helpers';
import { CristinApiPath } from '../../../api/apiPaths';
import { authenticatedApiRequest } from '../../../api/apiRequest';
import { CristinUser } from '../../../types/user.types';
import { isSuccessStatus } from '../../../utils/constants';
import { StyledCenterContainer } from '../../../components/styled/Wrappers';
import { AddEmployeeData, emptyUser } from './AddEmployeePage';
import { AffiliationHierarchy } from '../../../components/institution/AffiliationHierarchy';
import { getLanguageString } from '../../../utils/translation-helpers';

export const FindPersonPanel = () => {
  const { t } = useTranslation('basicData');
  const { values, setFieldValue } = useFormikContext<AddEmployeeData>();
  const [isLoading, setIsLoading] = useState(false);
  const nationalNumber = values.searchIdNumber;

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
      <Field name="searchIdNumber">
        {({ field }: FieldProps<string>) => (
          <TextField
            {...field}
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
      {isLoading ? (
        <CircularProgress />
      ) : nationalNumber.length === 11 ? (
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
                  required
                  fullWidth
                  variant="filled"
                  label={t('common:last_name')}
                  error={touched && !!error}
                  helperText={<ErrorMessage name={field.name} />}
                />
              )}
            </Field>
            <TextField disabled required fullWidth variant="filled" label={t('national_id')} value={nationalNumber} />
          </>
        )
      ) : null}
    </>
  );
};
