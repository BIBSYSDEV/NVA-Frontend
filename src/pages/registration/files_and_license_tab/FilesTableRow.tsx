import CancelIcon from '@mui/icons-material/Cancel';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
  Box,
  Checkbox,
  Collapse,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Link as MuiLink,
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
import { ErrorMessage, Field, FieldProps, getIn, useFormikContext } from 'formik';
import prettyBytes from 'pretty-bytes';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { TruncatableTypography } from '../../../components/TruncatableTypography';
import { RootState } from '../../../redux/store';
import { AssociatedFile, AssociatedFileType, FileRrs, FileVersion } from '../../../types/associatedArtifact.types';
import { CustomerRrsType } from '../../../types/customerInstitution.types';
import { LicenseUri, licenses } from '../../../types/license.types';
import { SpecificFileFieldNames } from '../../../types/publicationFieldNames';
import { Registration } from '../../../types/registration.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { equalUris } from '../../../utils/general-helpers';
import { administrativeAgreementId } from '../FilesAndLicensePanel';
import { DownloadFileButton } from './DownloadFileButton';

interface FilesTableRowProps {
  file: AssociatedFile;
  removeFile: () => void;
  baseFieldName: string;
  showFileVersion: boolean;
  disabled: boolean;
}

export const FilesTableRow = ({ file, removeFile, baseFieldName, showFileVersion, disabled }: FilesTableRowProps) => {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.user);
  const customer = useSelector((state: RootState) => state.customer);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const toggleOpenConfirmDialog = () => setOpenConfirmDialog(!openConfirmDialog);
  const { setFieldValue, setFieldTouched, errors, touched } = useFormikContext<Registration>();

  const fileTypeFieldName = `${baseFieldName}.${SpecificFileFieldNames.Type}`;
  const administrativeAgreementFieldName = `${baseFieldName}.${SpecificFileFieldNames.AdministrativeAgreement}`;
  const publisherVersionFieldName = `${baseFieldName}.${SpecificFileFieldNames.PublisherVersion}`;
  const licenseFieldName = `${baseFieldName}.${SpecificFileFieldNames.License}`;
  const embargoFieldName = `${baseFieldName}.${SpecificFileFieldNames.EmbargoDate}`;
  const legalNoteFieldName = `${baseFieldName}.${SpecificFileFieldNames.LegalNote}`;
  const rrsFieldName = `${baseFieldName}.${SpecificFileFieldNames.RightsRetentionStrategy}`;

  const isAcceptedFile = file.publisherVersion === FileVersion.Accepted;
  const rrsStrategy = file.rightsRetentionStrategy.configuredType ?? customer?.rightsRetentionStrategy.type;

  const isNullRrs = rrsStrategy === CustomerRrsType.NullRightsRetentionStrategy;
  const isCustomerRrs = rrsStrategy === CustomerRrsType.RightsRetentionStrategy;
  const isOverridableRrs = rrsStrategy === CustomerRrsType.OverridableRightsRetentionStrategy;

  const fileHasFunderRrs = file.rightsRetentionStrategy.type === 'FunderRightsRetentionStrategy';
  const fileHasCustomerRrs = file.rightsRetentionStrategy.type === 'CustomerRightsRetentionStrategy';
  const fileHasOverriddenRrs = file.rightsRetentionStrategy.type === 'OverriddenRightsRetentionStrategy';

  const canOverrideRrs = isAcceptedFile && (isOverridableRrs || (isCustomerRrs && user?.isPublishingCurator));

  const rrsPolicyLink = customer?.rightsRetentionStrategy.id ? (
    <MuiLink href={customer.rightsRetentionStrategy.id} target="_blank" rel="noopener noreferrer" />
  ) : null;

  const collapsibleHasError = !!getIn(errors, embargoFieldName) && !!getIn(touched, embargoFieldName);
  const [openCollapsable, setOpenCollapsable] = useState(collapsibleHasError);
  const [embargoPopperAnchorEl, setEmbargoPopperAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <>
      <TableRow data-testid={dataTestId.registrationWizard.files.fileRow} sx={{ td: { pb: 0, borderBottom: 'unset' } }}>
        <TableCell sx={{ minWidth: '13rem' }}>
          <TruncatableTypography>{file.name}</TruncatableTypography>
        </TableCell>

        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <DownloadFileButton file={file} />

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
                    setFieldValue(publisherVersionFieldName, null);
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
            <Field name={publisherVersionFieldName}>
              {({ field, meta: { error, touched } }: FieldProps<FileVersion | null>) => (
                <FormControl
                  data-testid={dataTestId.registrationWizard.files.version}
                  required
                  disabled={file.administrativeAgreement || disabled}>
                  <RadioGroup
                    {...field}
                    row
                    sx={{ flexWrap: 'nowrap' }}
                    onChange={(event) => {
                      const fileVersion = event.target.value as FileVersion;
                      setFieldValue(field.name, fileVersion);

                      if (fileVersion === FileVersion.Published) {
                        const nullRrsValue: FileRrs = {
                          type: 'NullRightsRetentionStrategy',
                          configuredType: rrsStrategy,
                        };
                        setFieldValue(rrsFieldName, nullRrsValue);
                        setFieldValue(licenseFieldName, null);
                      } else if (isCustomerRrs || isOverridableRrs) {
                        const customerRrsValue: FileRrs = {
                          type: 'CustomerRightsRetentionStrategy',
                          configuredType: rrsStrategy,
                        };
                        setFieldValue(rrsFieldName, customerRrsValue);
                        setFieldValue(licenseFieldName, LicenseUri.CC_BY_4);
                      }
                    }}>
                    <FormControlLabel
                      value={FileVersion.Accepted}
                      control={<Radio />}
                      label={t('registration.files_and_license.accepted')}
                    />
                    <FormControlLabel
                      value={FileVersion.Published}
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
          {fileHasCustomerRrs && (
            <Typography>
              <Trans t={t} i18nKey="registration.files_and_license.institution_prefers_cc_by">
                {rrsPolicyLink}
              </Trans>
            </Typography>
          )}
          {fileHasOverriddenRrs && (
            <Typography>
              <Trans t={t} i18nKey="registration.files_and_license.opted_out_of_rrs">
                {rrsPolicyLink}
              </Trans>
            </Typography>
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell sx={{ pt: 0, pb: 0 }} colSpan={showFileVersion ? 6 : 5}>
          <Collapse in={openCollapsable}>
            <Box
              sx={{
                m: '1rem 1rem 0 1rem',
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: '2rem',
              }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {isAcceptedFile && isNullRrs && (
                  <FormControlLabel
                    label={t('registration.files_and_license.mark_if_funder_requires_rrs')}
                    control={
                      <Checkbox
                        checked={fileHasFunderRrs}
                        onChange={() => {
                          if (fileHasFunderRrs) {
                            const nullRrsValue: FileRrs = {
                              type: 'NullRightsRetentionStrategy',
                              configuredType: rrsStrategy,
                            };
                            setFieldValue(rrsFieldName, nullRrsValue);
                            setFieldValue(licenseFieldName, null);
                          } else {
                            const newRrsValue: FileRrs = {
                              type: 'FunderRightsRetentionStrategy',
                              configuredType: rrsStrategy,
                            };
                            setFieldValue(rrsFieldName, newRrsValue);
                            setFieldValue(licenseFieldName, LicenseUri.CC_BY_4);
                          }
                        }}
                      />
                    }
                  />
                )}

                {fileHasCustomerRrs && isCustomerRrs && (
                  <Typography>
                    {t('registration.files_and_license.institution_rights_policy_opt_out_instructions')}
                  </Typography>
                )}

                {canOverrideRrs && (
                  <FormControlLabel
                    label={
                      <Trans t={t} i18nKey="registration.files_and_license.follow_institution_rights_policy">
                        {rrsPolicyLink}
                      </Trans>
                    }
                    control={
                      <Checkbox
                        checked={!fileHasOverriddenRrs}
                        onChange={() => {
                          if (fileHasOverriddenRrs) {
                            const customerRrsValue: FileRrs = {
                              type: 'CustomerRightsRetentionStrategy',
                              configuredType: rrsStrategy,
                            };
                            setFieldValue(rrsFieldName, customerRrsValue);
                            setFieldValue(licenseFieldName, LicenseUri.CC_BY_4);
                          } else {
                            const overriddenRrsValue: FileRrs = {
                              type: 'OverriddenRightsRetentionStrategy',
                              configuredType: rrsStrategy,
                            };
                            setFieldValue(rrsFieldName, overriddenRrsValue);
                            setFieldValue(licenseFieldName, null);
                          }
                        }}
                      />
                    }
                  />
                )}

                {user?.isPublishingCurator && (
                  <Field name={legalNoteFieldName}>
                    {({ field }: FieldProps<string>) => (
                      <TextField
                        {...field}
                        value={field.value ?? ''}
                        data-testid={dataTestId.registrationWizard.files.legalNoteField}
                        variant="filled"
                        fullWidth
                        label={t('registration.files_and_license.legal_note')}
                        multiline
                        disabled={disabled}
                        helperText={<ErrorMessage name={field.name} />}
                      />
                    )}
                  </Field>
                )}
              </Box>

              <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center', alignSelf: 'end' }}>
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
                      sx={{ minWidth: '15rem' }}
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
