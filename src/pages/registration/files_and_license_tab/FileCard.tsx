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
import { DatePicker } from '@mui/x-date-pickers';
import { AssociatedFile, LicenseNames, licenses } from '../../../types/file.types';
import { SpecificFileFieldNames } from '../../../types/publicationFieldNames';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { dataTestId } from '../../../utils/dataTestIds';

interface FileCardProps {
  file: AssociatedFile;
  removeFile: () => void;
  baseFieldName: string;
  toggleLicenseModal?: () => void;
}

export const FileCard = ({ file, removeFile, baseFieldName, toggleLicenseModal }: FileCardProps) => {
  const { t } = useTranslation();
  const { setFieldValue, setFieldTouched } = useFormikContext();
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const toggleOpenConfirmDialog = () => setOpenConfirmDialog(!openConfirmDialog);

  return (
    <Paper sx={{ padding: '1rem' }} elevation={5} data-testid={dataTestId.registrationWizard.files.fileCard}>
      <Box sx={{ display: 'flex', alignItems: 'start', gap: '2rem' }}>
        <Field name={`${baseFieldName}.${SpecificFileFieldNames.PublisherAuthority}`}>
          {({ field, meta: { error, touched } }: FieldProps) => (
            <FormControl
              data-testid={dataTestId.registrationWizard.files.version}
              required
              disabled={file.administrativeAgreement}>
              <FormLabel component="legend">{t('common.version')}</FormLabel>
              <RadioGroup
                {...field}
                row
                onChange={(event) => setFieldValue(field.name, JSON.parse(event.target.value))}>
                <FormControlLabel
                  value={false}
                  control={<Radio />}
                  label={t('registration.files_and_license.accepted_version')}
                />
                <FormControlLabel
                  value={true}
                  control={<Radio />}
                  label={t('registration.files_and_license.published_version')}
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
              label={t('registration.files_and_license.administrative_contract')}
            />
          )}
        </Field>
      </Box>

      <Divider sx={{ my: '1rem', borderWidth: 1 }} />

      <Box
        sx={{
          display: 'grid',
          gridTemplateAreas: {
            md: '"name size date license"',
            sm: '"name size" "date license"',
            xs: '"name size" "date date" "license license"',
          },
          gridTemplateColumns: {
            md: '1fr auto 1fr 1fr',
            sm: '3fr 1fr',
            xs: '3fr 1fr',
          },
          gap: { md: '3rem', xs: '1rem' },
          alignItems: 'center',
        }}>
        <Typography sx={{ fontWeight: 'bold', lineBreak: 'anywhere', gridArea: 'name' }}>{file.name}</Typography>
        <Typography gridArea="size">{prettyBytes(file.size, { locale: true })}</Typography>

        {file.administrativeAgreement ? (
          <Box sx={{ display: 'flex', gap: '0.5rem' }}>
            <LockIcon />
            <Typography fontStyle="italic">{t('registration.files_and_license.file_locked')}</Typography>
          </Box>
        ) : (
          <>
            <Field name={`${baseFieldName}.${SpecificFileFieldNames.EmbargoDate}`}>
              {({ field, meta: { error, touched } }: FieldProps) => (
                <Box sx={{ gridArea: 'date' }}>
                  <DatePicker
                    {...field}
                    label={t('registration.files_and_license.file_publish_date')}
                    PopperProps={{
                      'aria-label': t('registration.files_and_license.file_publish_date'),
                    }}
                    value={field.value ?? null}
                    onChange={(date) => setFieldValue(field.name, date ?? '')}
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
                            t('registration.files_and_license.file_publish_date_helper_text')
                          )
                        }
                      />
                    )}
                  />
                </Box>
              )}
            </Field>

            <Box sx={{ display: 'flex', gridArea: 'license', alignSelf: 'start' }}>
              <Field name={`${baseFieldName}.${SpecificFileFieldNames.License}`}>
                {({ field, meta: { error, touched } }: FieldProps) => (
                  <TextField
                    id={field.name}
                    data-testid={dataTestId.registrationWizard.files.selectLicenseField}
                    sx={{ minWidth: '15rem' }}
                    select
                    SelectProps={{
                      renderValue: (option) => {
                        const selectedLicense = licenses.find((license) => license.identifier === option);
                        return selectedLicense ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <img style={{ width: '5rem' }} src={selectedLicense.logo} alt="" />
                            <span>{t(`licenses.labels.${option}` as any)}</span>
                          </Box>
                        ) : null;
                      },
                    }}
                    variant="filled"
                    value={field.value?.identifier || ''}
                    error={!!error && touched}
                    helperText={<ErrorMessage name={field.name} />}
                    label={t('registration.files_and_license.conditions_for_using_file')}
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
                        data-testid={dataTestId.registrationWizard.files.licenseItem}
                        key={license.identifier}
                        value={license.identifier}
                        divider
                        dense
                        sx={{ gap: '1rem' }}>
                        <ListItemIcon>
                          <img style={{ width: '5rem' }} src={license.logo} alt={license.identifier} />
                        </ListItemIcon>
                        <ListItemText>
                          <Typography>{t(`licenses.labels.${license.identifier}`)}</Typography>
                        </ListItemText>
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              </Field>
              <Tooltip title={t('common.help')}>
                <IconButton
                  data-testid={dataTestId.registrationWizard.files.licenseHelpButton}
                  onClick={toggleLicenseModal}>
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
        data-testid={dataTestId.registrationWizard.files.removeFileButton}
        startIcon={<DeleteIcon />}
        onClick={toggleOpenConfirmDialog}>
        {t('registration.files_and_license.remove_file')}
      </Button>

      <ConfirmDialog
        open={openConfirmDialog}
        title={t('registration.files_and_license.remove_file')}
        onAccept={() => {
          removeFile();
          toggleOpenConfirmDialog();
        }}
        onCancel={toggleOpenConfirmDialog}>
        <Typography>{t('registration.files_and_license.remove_file_description', { fileName: file.name })}</Typography>
      </ConfirmDialog>
    </Paper>
  );
};
