import { ErrorMessage, Field, FieldProps, useFormikContext } from 'formik';
import prettyBytes from 'pretty-bytes';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  IconButton,
  ListItemText,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
  Typography,
  ListItemIcon,
  Paper,
  Box,
  Divider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LockIcon from '@mui/icons-material/LockOutlined';
import { DatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { datePickerTranslationProps } from '../../../themes/mainTheme';
import { File, LicenseNames, licenses } from '../../../types/file.types';
import { SpecificFileFieldNames } from '../../../types/publicationFieldNames';
import { getDateFnsLocale } from '../../../utils/date-helpers';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { dataTestId } from '../../../utils/dataTestIds';

interface FileCardProps {
  file: File;
  removeFile: () => void;
  baseFieldName: string;
  toggleLicenseModal?: () => void;
}

export const FileCard = ({ file, removeFile, baseFieldName, toggleLicenseModal }: FileCardProps) => {
  const { t, i18n } = useTranslation('registration');
  const { setFieldValue, setFieldTouched } = useFormikContext();
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const toggleOpenConfirmDialog = () => setOpenConfirmDialog(!openConfirmDialog);

  return (
    <Paper sx={{ padding: '1rem' }} elevation={5} data-testid="uploaded-file-card">
      <Box sx={{ display: 'flex', alignItems: 'start', gap: '2rem' }}>
        <Field name={`${baseFieldName}.${SpecificFileFieldNames.PublisherAuthority}`}>
          {({ field, meta: { error, touched } }: FieldProps) => (
            <FormControl
              data-testid={dataTestId.registrationWizard.files.version}
              required
              disabled={file.administrativeAgreement}>
              <FormLabel component="legend">{t('files_and_license.version')}</FormLabel>
              <RadioGroup
                {...field}
                row
                onChange={(event) => setFieldValue(field.name, JSON.parse(event.target.value))}>
                <FormControlLabel
                  value={false}
                  control={<Radio />}
                  label={t<string>('files_and_license.accepted_version')}
                />
                <FormControlLabel
                  value={true}
                  control={<Radio />}
                  label={t<string>('files_and_license.published_version')}
                />
              </RadioGroup>
              {error && touched && <FormHelperText error>{error}</FormHelperText>}
            </FormControl>
          )}
        </Field>

        <Field name={`${baseFieldName}.${SpecificFileFieldNames.AdministrativeAgreement}`}>
          {({ field }: FieldProps) => (
            <FormControlLabel
              sx={{ maxWidth: '30rem', pt: '1.25rem' }}
              data-testid={dataTestId.registrationWizard.files.administrativeAgreement}
              control={
                <Checkbox
                  {...field}
                  checked={field.value}
                  onChange={(event) => {
                    field.onChange(event);
                    setFieldValue(`${baseFieldName}.${SpecificFileFieldNames.PublisherAuthority}`, null);
                    setFieldValue(`${baseFieldName}.${SpecificFileFieldNames.License}`, null);
                    setFieldValue(`${baseFieldName}.${SpecificFileFieldNames.EmbargoDate}`, null);
                  }}
                />
              }
              label={t<string>('files_and_license.administrative_contract')}
            />
          )}
        </Field>
      </Box>

      <Divider sx={{ my: '1rem', borderWidth: 1 }} />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '3fr 1fr 3fr 3fr',
          gap: '3rem',
          alignItems: 'center',
        }}>
        <Typography sx={{ fontWeight: 'bold' }}>{file.name}</Typography>
        <Typography>{prettyBytes(file.size, { locale: true })}</Typography>

        {file.administrativeAgreement ? (
          <Box sx={{ display: 'flex', gap: '0.5rem' }}>
            <LockIcon />
            <Typography fontStyle="italic">{t('files_and_license.file_locked')}</Typography>
          </Box>
        ) : (
          <>
            <Field name={`${baseFieldName}.${SpecificFileFieldNames.EmbargoDate}`}>
              {({ field, meta: { error, touched } }: FieldProps) => (
                <LocalizationProvider dateAdapter={AdapterDateFns} locale={getDateFnsLocale(i18n.language)}>
                  <DatePicker
                    {...datePickerTranslationProps}
                    {...field}
                    label={t('description.date_published')}
                    value={field.value ?? null}
                    onChange={(value) => setFieldValue(field.name, value)}
                    inputFormat="dd.MM.yyyy"
                    maxDate={new Date(new Date().getFullYear() + 5, 11, 31)}
                    mask="__.__.____"
                    disabled={file.administrativeAgreement}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        data-testid={dataTestId.registrationWizard.files.embargoDateField}
                        variant="filled"
                        onBlur={() => !touched && setFieldTouched(field.name)}
                        error={!!error && touched}
                        helperText={
                          error && touched ? (
                            <ErrorMessage name={field.name} />
                          ) : (
                            t('files_and_license.embargo_date_helper_text')
                          )
                        }
                      />
                    )}
                  />
                </LocalizationProvider>
              )}
            </Field>

            <Box sx={{ display: 'flex' }}>
              <Field name={`${baseFieldName}.${SpecificFileFieldNames.License}`}>
                {({ field, meta: { error, touched } }: FieldProps) => (
                  <TextField
                    id={field.name}
                    data-testid="uploaded-file-select-license"
                    select
                    sx={{ width: '18rem' }}
                    SelectProps={{
                      renderValue: (option: any) => {
                        const selectedLicense = licenses.find((license) => license.identifier === option);
                        return selectedLicense ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <img
                              style={{ width: '5rem' }}
                              src={selectedLicense.logo}
                              alt={selectedLicense.identifier}
                            />
                            <span>{t(`licenses:labels.${option}`)}</span>
                          </Box>
                        ) : null;
                      },
                    }}
                    variant="filled"
                    value={field.value?.identifier || ''}
                    error={!!error && touched}
                    helperText={<ErrorMessage name={field.name} />}
                    label={t('files_and_license.conditions_for_using_file')}
                    required
                    onChange={({ target: { value } }) =>
                      setFieldValue(field.name, {
                        type: 'License',
                        identifier: value as LicenseNames,
                        labels: { nb: value },
                      })
                    }
                    disabled={file.administrativeAgreement}>
                    {licenses.map((license) => (
                      <MenuItem
                        data-testid="license-item"
                        key={license.identifier}
                        value={license.identifier}
                        divider
                        dense>
                        <ListItemIcon>
                          <img style={{ width: '50%' }} src={license.logo} alt={license.identifier} />
                        </ListItemIcon>
                        <ListItemText>
                          <Typography>{t(`licenses:labels.${license.identifier}`)}</Typography>
                        </ListItemText>
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              </Field>
              <Tooltip title={t<string>('common:help')}>
                <IconButton data-testid="button-toggle-license-modal" onClick={toggleLicenseModal}>
                  <HelpOutlineIcon fontSize="large" />
                </IconButton>
              </Tooltip>
            </Box>
          </>
        )}
      </Box>

      <Button
        sx={{ mt: '1rem', float: 'right' }}
        color="error"
        variant="outlined"
        data-testid="button-remove-file"
        startIcon={<DeleteIcon />}
        onClick={toggleOpenConfirmDialog}>
        {t('files_and_license.remove_file')}
      </Button>

      <ConfirmDialog
        open={openConfirmDialog}
        title={t('files_and_license.remove_file')}
        onAccept={() => {
          removeFile();
          toggleOpenConfirmDialog();
        }}
        onCancel={toggleOpenConfirmDialog}>
        <Typography>{t('files_and_license.remove_file_description', { fileName: file.name })}</Typography>
      </ConfirmDialog>
    </Paper>
  );
};
