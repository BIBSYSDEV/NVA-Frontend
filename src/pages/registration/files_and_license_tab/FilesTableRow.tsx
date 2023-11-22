import AttachFileIcon from '@mui/icons-material/AttachFile';
import CancelIcon from '@mui/icons-material/Cancel';
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
import { DatePicker } from '@mui/x-date-pickers';
import { useQuery } from '@tanstack/react-query';
import { ErrorMessage, Field, FieldProps, useFormikContext } from 'formik';
import prettyBytes from 'pretty-bytes';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { downloadPrivateFile } from '../../../api/fileApi';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { TruncatableTypography } from '../../../components/TruncatableTypography';
import { AssociatedFile, AssociatedFileType } from '../../../types/associatedArtifact.types';
import { licenses } from '../../../types/license.types';
import { SpecificFileFieldNames } from '../../../types/publicationFieldNames';
import { Registration } from '../../../types/registration.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { equalUris } from '../../../utils/general-helpers';
import { administrativeAgreementId } from '../FilesAndLicensePanel';

interface FilesTableRowProps {
  file: AssociatedFile;
  removeFile: () => void;
  toggleLicenseModal: () => void;
  baseFieldName: string;
  showFileVersion: boolean;
  disabled: boolean;
}

export const FilesTableRow = ({ file, removeFile, baseFieldName, showFileVersion, disabled }: FilesTableRowProps) => {
  const { t } = useTranslation();
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const toggleOpenConfirmDialog = () => setOpenConfirmDialog(!openConfirmDialog);
  const { values, setFieldValue, setFieldTouched } = useFormikContext<Registration>();
  const [downloadFile, setDownloadFile] = useState(false);

  const downloadFileQuery = useQuery({
    enabled: downloadFile,
    queryKey: ['downloadFile', values.identifier, file.identifier],
    queryFn: () => downloadPrivateFile(values.identifier, file.identifier),
    meta: { errorMessage: t('feedback.error.download_file') },
  });

  useEffect(() => {
    if (downloadFileQuery.data?.id) {
      // Use timeout to ensure that file is opened on Safari/iOS: NP-30205, https://stackoverflow.com/a/70463940
      setTimeout(() => {
        window.open(downloadFileQuery.data?.id, '_blank');
      });
    }
  }, [downloadFileQuery.data]);

  return (
    <TableRow data-testid={dataTestId.registrationWizard.files.fileRow}>
      <TableCell sx={{ minWidth: '13rem' }}>
        <Box sx={{ display: 'flex', gap: '0.5rem', justifyContent: 'space-between', alignItems: 'center' }}>
          <TruncatableTypography>{file.name}</TruncatableTypography>
        </Box>
      </TableCell>

      <TableCell>
        <Box sx={{ display: 'flex' }}>
          <IconButton size="small" onClick={() => setDownloadFile(true)}>
            <AttachFileIcon color="primary" />
          </IconButton>

          {!disabled && (
            <>
              <Tooltip title={t('registration.files_and_license.remove_file')}>
                <IconButton size="small" onClick={toggleOpenConfirmDialog}>
                  <CancelIcon color="primary" />
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
            </>
          )}
        </Box>
      </TableCell>

      <TableCell align="center" sx={{ minWidth: '5.5rem' }}>
        {prettyBytes(file.size)}
      </TableCell>

      <TableCell align="center">
        <Field name={`${baseFieldName}.${SpecificFileFieldNames.AdministrativeAgreement}`}>
          {({ field }: FieldProps) => (
            <Tooltip title={t('registration.files_and_license.administrative_contract')}>
              <Checkbox
                {...field}
                data-testid={dataTestId.registrationWizard.files.administrativeAgreement}
                checked={field.value}
                disabled={disabled}
                inputProps={{
                  'aria-labelledby': administrativeAgreementId,
                }}
                onChange={(event) => {
                  const newAssociatedFileType: AssociatedFileType =
                    field.value === true ? 'UnpublishedFile' : 'UnpublishableFile';
                  setFieldValue(`${baseFieldName}.${SpecificFileFieldNames.Type}`, newAssociatedFileType);

                  field.onChange(event);
                  setFieldValue(`${baseFieldName}.${SpecificFileFieldNames.PublisherAuthority}`, null);
                  setFieldValue(`${baseFieldName}.${SpecificFileFieldNames.License}`, null);
                  setFieldValue(`${baseFieldName}.${SpecificFileFieldNames.EmbargoDate}`, null);
                }}
              />
            </Tooltip>
          )}
        </Field>
      </TableCell>

      {showFileVersion && (
        <TableCell>
          <Field name={`${baseFieldName}.${SpecificFileFieldNames.PublisherAuthority}`}>
            {({ field, meta: { error, touched } }: FieldProps) => (
              <FormControl
                data-testid={dataTestId.registrationWizard.files.version}
                required
                disabled={file.administrativeAgreement || disabled}>
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
      )}

      <TableCell>
        <Field name={`${baseFieldName}.${SpecificFileFieldNames.EmbargoDate}`}>
          {({ field, meta: { error, touched } }: FieldProps) => (
            <Box sx={{ minWidth: '12rem' }}>
              <DatePicker
                {...field}
                label={t('registration.files_and_license.file_publish_date')}
                value={field.value ? new Date(field.value) : null}
                onChange={(date) => setFieldValue(field.name, date ?? '')}
                format="dd.MM.yyyy"
                maxDate={new Date(new Date().getFullYear() + 5, 11, 31)}
                disabled={file.administrativeAgreement || disabled}
                slotProps={{
                  textField: {
                    inputProps: { 'data-testid': dataTestId.registrationWizard.files.embargoDateField },
                    variant: 'filled',
                    onBlur: () => !touched && setFieldTouched(field.name),
                    error: !!error && touched,
                    helperText: <ErrorMessage name={field.name} />,
                  },
                }}
              />
            </Box>
          )}
        </Field>
      </TableCell>
      <TableCell>
        <Field name={`${baseFieldName}.${SpecificFileFieldNames.License}`}>
          {({ field, meta: { error, touched } }: FieldProps<string>) => (
            <TextField
              id={field.name}
              data-testid={dataTestId.registrationWizard.files.selectLicenseField}
              sx={{ minWidth: '15rem' }}
              select
              disabled={disabled}
              SelectProps={{
                renderValue: (option) => {
                  const selectedLicense = licenses.find((license) => equalUris(license.id, option as string));
                  return selectedLicense ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <img style={{ width: '5rem' }} src={selectedLicense.logo} alt={selectedLicense.name} />
                      <span>{selectedLicense.name}</span>
                    </Box>
                  ) : null;
                },
              }}
              variant="filled"
              value={licenses.find((license) => equalUris(license.id, field.value))?.id ?? ''}
              error={!!error && touched}
              helperText={<ErrorMessage name={field.name} />}
              label={t('registration.files_and_license.conditions_for_using_file')}
              required
              onChange={({ target: { value } }) => setFieldValue(field.name, value)}>
              {licenses
                .filter((license) => license.version === 4 || !license.version)
                .map((license) => (
                  <MenuItem
                    data-testid={dataTestId.registrationWizard.files.licenseItem}
                    key={license.id}
                    value={license.id}
                    divider
                    dense
                    sx={{ gap: '1rem' }}>
                    <ListItemIcon>
                      <img style={{ width: '5rem' }} src={license.logo} alt={license.name} />
                    </ListItemIcon>
                    <ListItemText>
                      <Typography>{license.name}</Typography>
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
