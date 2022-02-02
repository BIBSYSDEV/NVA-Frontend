import { LocalizationProvider, DatePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { ErrorMessage, Field, FieldProps, Form, Formik, FormikProps } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { InputContainerBox } from '../../../../components/styled/Wrappers';
import { RootStore } from '../../../../redux/reducers/rootReducer';
import { datePickerTranslationProps } from '../../../../themes/mainTheme';
import i18n from '../../../../translations/i18n';
import { SearchResponse } from '../../../../types/common.types';
import { Organization } from '../../../../types/institution.types';
import { CoordinatingInstitution, CristinProject } from '../../../../types/project.types';
import { getDateFnsLocale } from '../../../../utils/date-helpers';
import { useFetch } from '../../../../utils/hooks/useFetch';
import { useFetchResource } from '../../../../utils/hooks/useFetchResource';
import { getLanguageString } from '../../../../utils/translation-helpers';
import {
  OrganizationSearchField,
  SelectInstitutionField,
} from '../../../admin/customerInstitutionFields/SelectInstitutionField';

// interface CreateProjectDialogProps extends DialogProps {}

interface CristinAffiliation {
  active: boolean;
  organization: string;
  role: any;
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

const getValueByKey = (key: string, items: CristinArrayValue[]) => {
  return items.find((item) => item.type === key)?.value;
};

type BasicCristinProject = Pick<CristinProject, 'title' | 'startDate' | 'coordinatingInstitution' | 'contributors'>;

export const CreateProjectDialog = (props: DialogProps) => {
  const { t } = useTranslation('registration');
  const user = useSelector((store: RootStore) => store.user);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchPath, setSearchPath] = useState('');

  const [institution, isLoadingInstitution] = useFetchResource<Organization>(user?.cristinId ?? '');
  const [searchByNameResults, isLoadingSearchByName] = useFetch<SearchResponse<CristinUser>>({
    url: searchPath,
  });
  console.log(searchByNameResults);
  const initialValues: BasicCristinProject = {
    title: '',
    startDate: '',
    contributors: [
      // {
      //   type: 'ProjectManager',
      //   identity: { type: 'Person', id: '', firstName: user?.givenName ?? '', lastName: user?.familyName ?? '' },
      //   affiliation: {
      //     type: 'Organization',
      //     id: user?.cristinId ?? '',
      //     name: institution?.name ? institution.name : {},
      //   },
      // },
    ],
    coordinatingInstitution: {
      type: 'Organization',
      id: '',
      name: {},
    },
  };

  return (
    <Dialog {...props}>
      <DialogTitle>Opprett prosjekt</DialogTitle>
      {isLoadingInstitution ? (
        <CircularProgress />
      ) : (
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

                <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <TextField
                    variant="filled"
                    label="Søk på navn"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                  />
                  <Button variant="outlined" onClick={() => setSearchPath(`/cristin/person?query=${searchTerm}`)}>
                    Søk
                  </Button>
                </Box>
                <Box>
                  {isLoadingSearchByName ? (
                    <CircularProgress />
                  ) : (
                    searchByNameResults?.hits.map((person) => (
                      <p key={person.id}>
                        {getValueByKey('FirstName', person.names)} {getValueByKey('LastName', person.names)}
                      </p>
                    ))
                  )}
                </Box>
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
      )}
    </Dialog>
  );
};
