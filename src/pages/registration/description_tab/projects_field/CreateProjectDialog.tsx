import { LocalizationProvider, DatePicker, LoadingButton } from '@mui/lab';
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
import { ErrorMessage, Field, FieldProps, Form, Formik } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { CristinApiPath } from '../../../../api/apiPaths';
import { authenticatedApiRequest } from '../../../../api/apiRequest';
import { AffiliationHierarchy } from '../../../../components/institution/AffiliationHierarchy';
import { InputContainerBox } from '../../../../components/styled/Wrappers';
import { setNotification } from '../../../../redux/actions/notificationActions';
import { datePickerTranslationProps } from '../../../../themes/mainTheme';
import { SearchResponse } from '../../../../types/common.types';
import {
  BasicCoordinatingInstitution,
  BasicProjectContributor,
  PostCristinProject,
} from '../../../../types/project.types';
import { CristinArrayValue, CristinUser } from '../../../../types/user.types';
import { isErrorStatus, isSuccessStatus } from '../../../../utils/constants';
import { getDateFnsLocale } from '../../../../utils/date-helpers';
import { useDebounce } from '../../../../utils/hooks/useDebounce';
import { useFetch } from '../../../../utils/hooks/useFetch';
import { getNewDateValue } from '../../../../utils/registration-helpers';
import { basicProjectValidationSchema } from '../../../../utils/validation/project/BasicProjectValidation';
import { OrganizationSearchField } from '../../../admin/customerInstitutionFields/OrganizationSearchField';

const getValueByKey = (key: string, items?: CristinArrayValue[]) =>
  items?.find((item) => item.type === key)?.value ?? '';

const getFullName = (names: CristinArrayValue[]) =>
  `${getValueByKey('FirstName', names)} ${getValueByKey('LastName', names)}`;

const initialValues: PostCristinProject = {
  type: 'Project',
  title: '',
  language: 'http://lexvo.org/id/iso639-3/nor',
  startDate: '',
  endDate: '',
  contributors: [],
  coordinatingInstitution: {
    type: 'Organization',
    id: '',
  },
};

interface CreateProjectDialogProps extends DialogProps {
  onClose: () => void;
}

export const CreateProjectDialog = (props: CreateProjectDialogProps) => {
  const { t, i18n } = useTranslation('project');
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm);

  const [searchByNameResults, isLoadingSearchByName] = useFetch<SearchResponse<CristinUser>>({
    url: debouncedSearchTerm ? `${CristinApiPath.Person}?results=20&query=${debouncedSearchTerm}` : '',
  });

  const createProject = async (values: PostCristinProject) => {
    const createProjectResponse = await authenticatedApiRequest({
      url: CristinApiPath.Project,
      method: 'POST',
      data: values,
    });

    if (isSuccessStatus(createProjectResponse.status)) {
      dispatch(setNotification(t('feedback:success.create_project')));
      props.onClose();
    } else if (isErrorStatus(createProjectResponse.status)) {
      dispatch(setNotification(t('feedback:error.create_project'), 'error'));
    }
  };

  return (
    <Dialog {...props}>
      <DialogTitle>{t('create_project')}</DialogTitle>

      <Formik initialValues={initialValues} validationSchema={basicProjectValidationSchema} onSubmit={createProject}>
        {({ isSubmitting, setFieldValue }) => (
          <Form noValidate>
            <DialogContent>
              <InputContainerBox>
                <Field name="title">
                  {({ field, meta: { touched, error } }: FieldProps<string>) => (
                    <TextField
                      {...field}
                      label={t('common:title')}
                      required
                      variant="filled"
                      fullWidth
                      error={touched && !!error}
                      helperText={<ErrorMessage name={field.name} />}
                    />
                  )}
                </Field>
                <Field name="coordinatingInstitution.id">
                  {({ field, meta: { touched, error } }: FieldProps<string>) => (
                    <OrganizationSearchField
                      label={t('project:coordinating_institution')}
                      onChange={(selectedInstitution) => {
                        const newOrg: BasicCoordinatingInstitution = {
                          type: 'Organization',
                          id: selectedInstitution?.id ?? '',
                        };
                        setFieldValue('coordinatingInstitution', newOrg);
                      }}
                      errorMessage={touched && !!error ? error : undefined}
                      fieldInputProps={field}
                    />
                  )}
                </Field>

                <Box sx={{ display: 'flex', gap: '1rem' }}>
                  <LocalizationProvider dateAdapter={AdapterDateFns} locale={getDateFnsLocale(i18n.language)}>
                    <Field name="startDate">
                      {({ field, meta: { touched, error } }: FieldProps<string>) => (
                        <DatePicker
                          {...datePickerTranslationProps}
                          label={t('start_date')}
                          onChange={(date: Date | null, keyboardValue) => {
                            const newDate = getNewDateValue(date, keyboardValue, 12);
                            setFieldValue(field.name, newDate);
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
                      )}
                    </Field>

                    <Field name="endDate">
                      {({ field, meta: { touched, error } }: FieldProps<string>) => (
                        <DatePicker
                          {...datePickerTranslationProps}
                          label={t('end_date')}
                          onChange={(date: Date | null, keyboardValue) => {
                            const newDate = getNewDateValue(date, keyboardValue, 12);
                            setFieldValue(field.name, newDate);
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
                      )}
                    </Field>
                  </LocalizationProvider>
                </Box>
              </InputContainerBox>

              <Typography variant="h3" gutterBottom sx={{ mt: '1rem' }}>
                {t('project_manager')}
              </Typography>
              <Field name="contributors">
                {({ field, meta: { touched, error } }: FieldProps<BasicProjectContributor[]>) =>
                  field.value.length === 0 ? (
                    <Autocomplete
                      options={searchByNameResults?.hits ?? []}
                      inputMode="search"
                      getOptionLabel={(option) => getFullName(option.names)}
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

                          const newUser: BasicProjectContributor = {
                            type: 'ProjectManager',
                            identity: {
                              type: 'Person',
                              id: selectedUser.id ?? '',
                              firstName: getValueByKey('FirstName', selectedUser?.names),
                              lastName: getValueByKey('LastName', selectedUser?.names),
                            },
                            affiliation: {
                              type: 'Organization',
                              id: orgId,
                            },
                          };
                          setFieldValue(field.name, [newUser]);
                        }
                        setSearchTerm('');
                      }}
                      loading={isLoadingSearchByName}
                      renderOption={(props, option) => {
                        const orgId = option.affiliations.length > 0 ? option.affiliations[0].organization ?? '' : '';
                        return (
                          <li {...props} key={option.id}>
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                              <Typography variant="subtitle1">{getFullName(option.names)}</Typography>
                              {orgId && <AffiliationHierarchy unitUri={orgId} commaSeparated />}
                            </Box>
                          </li>
                        );
                      }}
                      renderInput={(params) => (
                        <TextField
                          onBlur={field.onBlur}
                          value={field.value}
                          name={field.name}
                          {...params}
                          required
                          label={t('person')}
                          placeholder={t('search_for_person')}
                          variant="filled"
                          error={touched && !!error}
                          helperText={<ErrorMessage name={field.name} />}
                        />
                      )}
                    />
                  ) : (
                    <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <Typography>
                        {`${field.value[0].identity.firstName} ${field.value[0].identity.lastName}`}
                      </Typography>
                      {field.value[0].affiliation?.id && (
                        <AffiliationHierarchy unitUri={field.value[0].affiliation.id} commaSeparated />
                      )}
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => setFieldValue(field.name, [])}>
                        {t('common:remove')}
                      </Button>
                    </Box>
                  )
                }
              </Field>
            </DialogContent>

            <DialogActions>
              <Button onClick={props.onClose}>{t('common:cancel')}</Button>
              <LoadingButton variant="contained" type="submit" loading={isSubmitting}>
                {t('common:save')}
              </LoadingButton>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};
