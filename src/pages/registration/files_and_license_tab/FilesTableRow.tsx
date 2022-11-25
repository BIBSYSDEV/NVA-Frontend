import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Radio,
  RadioGroup,
  TableCell,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import { DatePicker } from '@mui/x-date-pickers';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import prettyBytes from 'pretty-bytes';
import { Field, FieldProps, ErrorMessage, useFormikContext } from 'formik';
import { AssociatedFile, LicenseNames, licenses } from '../../../types/associatedArtifact.types';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { SpecificFileFieldNames } from '../../../types/publicationFieldNames';
import { dataTestId } from '../../../utils/dataTestIds';
import { TruncatableTypography } from '../../../components/TruncatableTypography';

interface FilesTableRowProps {
  file: AssociatedFile;
  removeFile: () => void;
  toggleLicenseModal: () => void;
  baseFieldName: string;
}

export const FilesTableRow = ({ file, removeFile, baseFieldName }: FilesTableRowProps) => {
  const { t } = useTranslation();
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const toggleOpenConfirmDialog = () => setOpenConfirmDialog(!openConfirmDialog);
  const { setFieldValue, setFieldTouched } = useFormikContext();

  return (
    <TableRow data-testid={dataTestId.registrationWizard.files.fileRow}>
      <TableCell sx={{ wordBreak: 'break-word', minWidth: '8rem' }}>
        <TruncatableTypography>{file.name}</TruncatableTypography>
      </TableCell>

      <TableCell align="center">
        <Tooltip title={t('registration.files_and_license.remove_file')}>
          <IconButton onClick={toggleOpenConfirmDialog}>
            <CancelIcon color="error" />
          </IconButton>
        </Tooltip>
        <ConfirmDialog
          open={openConfirmDialog}
          title={t('registration.files_and_license.remove_file')}
          onAccept={() => {
            removeFile();
            toggleOpenConfirmDialog();
          }}
          onCancel={toggleOpenConfirmDialog}>
          <Typography>
            {t('registration.files_and_license.remove_file_description', { fileName: file.name })}
          </Typography>
        </ConfirmDialog>
      </TableCell>

      <TableCell align="center">{prettyBytes(file.size)}</TableCell>

      <TableCell align="center">
        <Field name={`${baseFieldName}.${SpecificFileFieldNames.AdministrativeAgreement}`}>
          {({ field }: FieldProps) => (
            <FormControlLabel
              data-testid={dataTestId.registrationWizard.files.administrativeAgreement}
              control={
                <Tooltip title={t('registration.files_and_license.administrative_contract')}>
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
                </Tooltip>
              }
              label=""
            />
          )}
        </Field>
      </TableCell>

      <TableCell>
        <Field name={`${baseFieldName}.${SpecificFileFieldNames.PublisherAuthority}`}>
          {({ field, meta: { error, touched } }: FieldProps) => (
            <FormControl
              data-testid={dataTestId.registrationWizard.files.version}
              required
              disabled={file.administrativeAgreement}>
              <RadioGroup
                {...field}
                row
                onChange={(event) => setFieldValue(field.name, JSON.parse(event.target.value))}>
                <FormControlLabel
                  value={false}
                  control={<Radio />}
                  label={t('registration.files_and_license.accepted')}
                />
                <FormControlLabel
                  value={true}
                  control={<Radio />}
                  label={t('registration.files_and_license.published')}
                />
              </RadioGroup>
              {error && touched && <FormHelperText error>{error}</FormHelperText>}
            </FormControl>
          )}
        </Field>
      </TableCell>

      <TableCell>
        <Field name={`${baseFieldName}.${SpecificFileFieldNames.EmbargoDate}`}>
          {({ field, meta: { error, touched } }: FieldProps) => (
            <Box sx={{ minWidth: '12rem' }}>
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
                    helperText={<ErrorMessage name={field.name} />}
                  />
                )}
              />
            </Box>
          )}
        </Field>
      </TableCell>

      <TableCell>
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
      </TableCell>
    </TableRow>
  );
};
