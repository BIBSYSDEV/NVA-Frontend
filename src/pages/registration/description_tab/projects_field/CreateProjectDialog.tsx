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
import { ErrorMessage, Field, FieldArray, FieldArrayRenderProps, FieldProps, Form, Formik, FormikProps } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiRequest } from '../../../../api/apiRequest';
import { InputContainerBox } from '../../../../components/styled/Wrappers';
import { datePickerTranslationProps } from '../../../../themes/mainTheme';
import i18n from '../../../../translations/i18n';
import { LanguageString, SearchResponse } from '../../../../types/common.types';
import { CoordinatingInstitution, CristinProject, ProjectContributor } from '../../../../types/project.types';
import { isSuccessStatus } from '../../../../utils/constants';
import { getDateFnsLocale } from '../../../../utils/date-helpers';
import { useDebounce } from '../../../../utils/hooks/useDebounce';
import { useFetch } from '../../../../utils/hooks/useFetch';
import { getLanguageString } from '../../../../utils/translation-helpers';
import { OrganizationSearchField } from '../../../admin/customerInstitutionFields/SelectInstitutionField';

// interface CreateProjectDialogProps extends DialogProps {}

interface CristinAffiliation {
  active: boolean;
  organization: string;
  role: {
    labels: LanguageString;
  };
}

interface CristinIdentifier {
  type: 'CristinIdentifier' | 'NationalIdentificationNumber';
  value: string;
}

interface CristinName {
  type: 'FirstName' | 'LastName';
  value: string;
}

interface CristinUser {
  id: string;
  affiliations: CristinAffiliation[];
  identifiers: CristinIdentifier[];
  names: CristinName[];
}

interface CristinArrayValue {
  type: string;
  value: string;
}

const getValueByKey = (key: string, items?: CristinArrayValue[]) => {
  return items?.find((item) => item.type === key)?.value ?? '';
};

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
  const { t } = useTranslation('registration');

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm);

  const [searchByNameResults, isLoadingSearchByName] = useFetch<SearchResponse<CristinUser>>({
    url: debouncedSearchTerm ? `/cristin/person?query=${debouncedSearchTerm}` : '',
  });

  return (
    <Dialog {...props}>
      <DialogTitle>Opprett prosjekt</DialogTitle>

      <Formik initialValues={initialValues} onSubmit={(values) => console.log('Values', values)}>
        {({ values }: FormikProps<BasicCristinProject>) => (
          <Form>
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
                <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', alignItems: 'center' }}>
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
                        selectedOrganizationId={field.value}
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
                          renderInput={(params) => <TextField {...params} variant="filled" required />}
                        />
                      </LocalizationProvider>
                    )}
                  </Field>
                </Box>
                <Typography variant="h3" gutterBottom>
                  Prosjektleder
                </Typography>
              </InputContainerBox>

              {values.contributors.length === 0 ? (
                <FieldArray name="contributors">
                  {({ push, remove }: FieldArrayRenderProps) => (
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
                        const orgId = selectedUser?.affiliations[0].organization ?? '';

                        const institutionResponse = await apiRequest<any>({ url: orgId }); // todo: type
                        if (isSuccessStatus(institutionResponse.status)) {
                          const newUser: ProjectContributor = {
                            type: 'ProjectManager',
                            identity: {
                              type: 'Person',
                              id: selectedUser?.id ?? '',
                              firstName: getValueByKey('FirstName', selectedUser?.names),
                              lastName: getValueByKey('LastName', selectedUser?.names),
                            },
                            affiliation: {
                              type: 'Organization',
                              id: orgId,
                              name: institutionResponse.data.unit_name,
                            },
                          };
                          push(newUser);
                        }

                        setSearchTerm('');
                      }}
                      loading={isLoadingSearchByName}
                      renderOption={(props, option: CristinUser, state) => (
                        <li {...props}>
                          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="subtitle1">
                              {getValueByKey('FirstName', option.names)} {getValueByKey('LastName', option.names)}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {getLanguageString(option.affiliations[0].role.labels)}
                            </Typography>
                          </Box>
                        </li>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={t('Cristin-person')}
                          placeholder="Søk etter person"
                          variant="filled"
                          // error={touched && !!error}
                          // helperText={<ErrorMessage name={field.name} />}
                        />
                      )}
                    />
                  )}
                </FieldArray>
              ) : (
                <Typography>
                  {values.contributors[0].identity.firstName} {values.contributors[0].identity.lastName}
                </Typography>
              )}
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
