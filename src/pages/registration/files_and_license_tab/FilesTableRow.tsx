import AttachFileIcon from '@mui/icons-material/AttachFile';
import CancelIcon from '@mui/icons-material/Cancel';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
  Box,
  Checkbox,
  CircularProgress,
  Collapse,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Popover,
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
import { ErrorMessage, Field, FieldProps, getIn, useFormikContext } from 'formik';
import prettyBytes from 'pretty-bytes';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { downloadPrivateFile2 } from '../../../api/fileApi';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { TruncatableTypography } from '../../../components/TruncatableTypography';
import { AssociatedFile, AssociatedFileType } from '../../../types/associatedArtifact.types';
import { licenses } from '../../../types/license.types';
import { SpecificFileFieldNames } from '../../../types/publicationFieldNames';
import { Registration } from '../../../types/registration.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { equalUris } from '../../../utils/general-helpers';
import { openFileInNewTab } from '../../../utils/registration-helpers';
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
  const { values, setFieldValue, setFieldTouched, errors, touched } = useFormikContext<Registration>();
  const [downloadFile, setDownloadFile] = useState(false);

  const fileTypeFieldName = `${baseFieldName}.${SpecificFileFieldNames.Type}`;
  const administrativeAgreementFieldName = `${baseFieldName}.${SpecificFileFieldNames.AdministrativeAgreement}`;
  const publisherAuthorityFieldName = `${baseFieldName}.${SpecificFileFieldNames.PublisherAuthority}`;
  const licenseFieldName = `${baseFieldName}.${SpecificFileFieldNames.License}`;
  const embargoFieldName = `${baseFieldName}.${SpecificFileFieldNames.EmbargoDate}`;

  const collapsibleHasError = !!getIn(errors, embargoFieldName) && !!getIn(touched, embargoFieldName);
  const [openCollapsable, setOpenCollapsable] = useState(collapsibleHasError);
  const [embargoPopperAnchorEl, setEmbargoPopperAnchorEl] = useState<null | HTMLElement>(null);

  const downloadFileQuery = useQuery({
    enabled: downloadFile,
    queryKey: ['downloadFile', values.identifier, file.identifier],
    queryFn: async () => {
      const downloadFileResponse = await downloadPrivateFile2(values.identifier, file.identifier);
      if (downloadFileResponse?.id) {
        openFileInNewTab(downloadFileResponse.id);
      }
      setDownloadFile(false); // Ensure that a new URL is obtained every time, due to expiration
      return downloadFileResponse;
    },
    meta: { errorMessage: t('feedback.error.download_file') },
    cacheTime: 0,
  });

  return (
    <>
      <TableRow data-testid={dataTestId.registrationWizard.files.fileRow} sx={{ td: { pb: 0, borderBottom: 'unset' } }}>
        <TableCell sx={{ minWidth: '13rem' }}>
          <Box sx={{ display: 'flex', gap: '0.5rem', justifyContent: 'space-between', alignItems: 'center' }}>
            <TruncatableTypography>{file.name}</TruncatableTypography>
          </Box>
        </TableCell>

        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: 'fit-content' }}>
            {downloadFileQuery.isFetching ? (
              <CircularProgress size="1.5rem" />
            ) : (
              <Tooltip title={t('registration.files_and_license.open_file')}>
                <IconButton size="small" onClick={() => setDownloadFile(true)}>
                  <AttachFileIcon color="primary" />
                </IconButton>
              </Tooltip>
            )}

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

        <TableCell>{prettyBytes(file.size)}</TableCell>

        <TableCell>
          <Field name={administrativeAgreementFieldName}>
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
                    setFieldValue(fileTypeFieldName, newAssociatedFileType);

                    field.onChange(event);
                    setFieldValue(publisherAuthorityFieldName, null);
                    setFieldValue(licenseFieldName, null);
                    setFieldValue(embargoFieldName, null);
                  }}
                />
              </Tooltip>
            )}
          </Field>
        </TableCell>

        {showFileVersion && (
          <TableCell>
            <Field name={publisherAuthorityFieldName}>
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
          <Field name={licenseFieldName}>
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
      <TableRow>
        <TableCell sx={{ pt: 0, pb: 0 }} colSpan={showFileVersion ? 6 : 5}>
          <Collapse in={openCollapsable}>
            <Box sx={{ mt: '0.5rem', display: 'flex', justifyContent: 'space-evenly' }}>
              <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <Field name={embargoFieldName}>
                  {({ field, meta: { error, touched } }: FieldProps) => (
                    <DatePicker
                      {...field}
                      label={t('registration.files_and_license.embargo')}
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
                  )}
                </Field>

                <Tooltip title={t('common.help')}>
                  <IconButton onClick={(event) => setEmbargoPopperAnchorEl(event.currentTarget)}>
                    <HelpOutlineIcon />
                  </IconButton>
                </Tooltip>
                <Popover
                  open={!!embargoPopperAnchorEl}
                  anchorEl={embargoPopperAnchorEl}
                  onClose={() => setEmbargoPopperAnchorEl(null)}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}>
                  <Paper sx={{ p: '1rem' }}>
                    <Typography>{t('registration.files_and_license.file_publish_date_helper_text')}</Typography>
                  </Paper>
                </Popover>
              </Box>
            </Box>
          </Collapse>
          <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
            <IconButton
              onClick={() => setOpenCollapsable(!openCollapsable)}
              size="small"
              data-testid={dataTestId.registrationWizard.files.expandFileRowButton}>
              {openCollapsable ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </Box>
        </TableCell>
      </TableRow>
    </>
  );
};
