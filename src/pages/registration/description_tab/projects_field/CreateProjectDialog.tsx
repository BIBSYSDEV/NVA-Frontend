import { LocalizationProvider, DatePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import { ErrorMessage, Field, FieldProps, Form, Formik, FormikProps } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiRequest } from '../../../../api/apiRequest';
import { InputContainerBox } from '../../../../components/styled/Wrappers';
import { datePickerTranslationProps } from '../../../../themes/mainTheme';
import { SearchResponse } from '../../../../types/common.types';
import { CoordinatingInstitution, CristinProject, ProjectContributor } from '../../../../types/project.types';
import { CristinUser } from '../../../../types/user.types';
import { isSuccessStatus } from '../../../../utils/constants';
import { getDateFnsLocale } from '../../../../utils/date-helpers';
import { useDebounce } from '../../../../utils/hooks/useDebounce';
import { useFetch } from '../../../../utils/hooks/useFetch';
import { getLanguageString } from '../../../../utils/translation-helpers';
import { basicProjectValidationSchema } from '../../../../utils/validation/project/BasicProjectValidation';
import { OrganizationSearchField } from '../../../admin/customerInstitutionFields/SelectInstitutionField';

interface CristinArrayValue {
  type: string;
  value: string;
}

const getValueByKey = (key: string, items?: CristinArrayValue[]) =>
  items?.find((item) => item.type === key)?.value ?? '';

type BasicCristinProject = Pick<CristinProject, 'title' | 'startDate' | 'coordinatingInstitution' | 'contributors'>;

const initialValues: BasicCristinProject = {
  title: '',
  startDate: '',
  contributors: [],
  coordinatingInstitution: {
    type: 'Organization',
    id: '',
    name: {},
  },
};

export const CreateProjectDialog = (props: DialogProps) => {
  const { t, i18n } = useTranslation('registration');

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm);

  const [searchByNameResults, isLoadingSearchByName] = useFetch<SearchResponse<CristinUser>>({
    url: debouncedSearchTerm ? `/cristin/person?results=50&query=${debouncedSearchTerm}` : '',
  });

  return (
    <Dialog {...props}>
      <DialogTitle>Opprett prosjekt</DialogTitle>

      <Formik
        initialValues={initialValues}
        validationSchema={basicProjectValidationSchema}
        onSubmit={(values) => console.log('Values', values)}>
        {({ values }: FormikProps<BasicCristinProject>) => (
          <Form noValidate>
            <DialogContent>
              <InputContainerBox>
                <Field name={'title'}>
                  {({ field, meta: { touched, error } }: FieldProps) => (
                    <TextField
                      {...field}
                      label={'Tittel'}
                      required
                      variant="filled"
                      fullWidth
                      error={touched && !!error}
                      helperText={<ErrorMessage name={field.name} />}
                    />
                  )}
                </Field>
                <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', alignItems: 'start' }}>
                  <Field name={'coordinatingInstitution.id'}>
                    {({ field, form: { setFieldValue }, meta: { touched, error } }: FieldProps) => (
                      <OrganizationSearchField
                        onChange={(selectedInstitution) => {
                          const newOrg: CoordinatingInstitution = {
                            type: 'Organization',
                            id: selectedInstitution?.id ?? '',
                            name: selectedInstitution?.name ?? {},
                          };
                          setFieldValue('coordinatingInstitution', newOrg);
                        }}
                        errorMessage={touched && !!error ? error : undefined}
                        fieldInputProps={field}
                      />
                    )}
                  </Field>

                  <Field name={'startDate'}>
                    {({ field, form: { setFieldValue }, meta: { touched, error } }: FieldProps) => (
                      <LocalizationProvider dateAdapter={AdapterDateFns} locale={getDateFnsLocale(i18n.language)}>
                        <DatePicker
                          {...datePickerTranslationProps}
                          label={t('Startdato')}
                          onChange={(date: Date | null) => {
                            if (date instanceof Date && !isNaN(date.getTime())) {
                              setFieldValue(field.name, date.toISOString());
                            }
                          }}
                          value={field.value ? new Date(field.value) : null}
                          inputFormat="dd.MM.yyyy"
                          mask="__.__.____"
                          renderInput={(params) => (
                            <TextField
                              {...field}
                              {...params}
                              variant="filled"
                              required
                              error={touched && !!error}
                              helperText={<ErrorMessage name={field.name} />}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    )}
                  </Field>
                </Box>
                <Typography variant="h3" gutterBottom>
                  Prosjektleder
                </Typography>
              </InputContainerBox>

              <Field name={'contributors'}>
                {({ field, form: { setFieldValue }, meta: { touched, error } }: FieldProps) =>
                  field.value.length === 0 ? (
                    <Autocomplete
                      options={searchByNameResults?.hits ?? []}
                      inputMode="search"
                      getOptionLabel={(option) =>
                        `${getValueByKey('FirstName', option.names)} ${getValueByKey('LastName', option.names)}`
                      }
                      filterOptions={(options) => options}
                      onInputChange={(_, value, reason) => {
                        if (reason !== 'reset') {
                          setSearchTerm(value);
                        }
                      }}
                      onChange={async (_, selectedUser) => {
                        if (!selectedUser) {
                          if (field.value.length > 0) {
                            setFieldValue(field.name, []);
                          }
                        } else {
                          const orgId =
                            selectedUser.affiliations.length > 0 ? selectedUser.affiliations[0].organization ?? '' : '';

                          const newUser: Partial<ProjectContributor> = {
                            type: 'ProjectManager',
                            identity: {
                              type: 'Person',
                              id: selectedUser.id ?? '',
                              firstName: getValueByKey('FirstName', selectedUser?.names),
                              lastName: getValueByKey('LastName', selectedUser?.names),
                            },
                          };

                          if (orgId) {
                            const institutionResponse = await apiRequest<any>({ url: orgId }); // todo: type
                            if (isSuccessStatus(institutionResponse.status)) {
                              newUser.affiliation = {
                                type: 'Organization',
                                id: orgId,
                                name: institutionResponse.data.unit_name,
                              };
                            }
                          }
                          setFieldValue(field.name, [newUser]);
                          setSearchTerm('');
                        }
                      }}
                      loading={isLoadingSearchByName}
                      renderOption={(props, option) => (
                        <li {...props} key={option.id}>
                          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="subtitle1">
                              {getValueByKey('FirstName', option.names)} {getValueByKey('LastName', option.names)}
                            </Typography>
                            {option.affiliations.length > 0 && (
                              <Typography variant="body2" color="textSecondary">
                                {getLanguageString(option.affiliations[0].role.labels ?? {})}
                              </Typography>
                            )}
                          </Box>
                        </li>
                      )}
                      renderInput={(params) => (
                        <TextField
                          onBlur={field.onBlur}
                          value={field.value}
                          name={field.name}
                          {...params}
                          required
                          label={t('Cristin-person')}
                          placeholder="Søk etter person"
                          variant="filled"
                          error={touched && !!error}
                          helperText={<ErrorMessage name={field.name} />}
                        />
                      )}
                    />
                  ) : (
                    <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <Typography>
                        {field.value[0].identity.firstName} {field.value[0].identity.lastName}
                      </Typography>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => setFieldValue(field.name, [])}>
                        Fjern
                      </Button>
                    </Box>
                  )
                }
              </Field>
            </DialogContent>

            <DialogActions>
              <Button>Avbryt</Button>
              <Button variant="contained" type="submit">
                Lagre
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};
