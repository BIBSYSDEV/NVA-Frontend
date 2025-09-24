import BlockIcon from '@mui/icons-material/Block';
import CheckIcon from '@mui/icons-material/Check';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
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
  styled,
  TableCell,
  TableCellProps,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useMutation } from '@tanstack/react-query';
import { ErrorMessage, Field, FieldProps, getIn, useFormikContext } from 'formik';
import prettyBytes from 'pretty-bytes';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { deleteImportCandidateFile, deleteRegistrationFile } from '../../../api/fileApi';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { TruncatableTypography } from '../../../components/TruncatableTypography';
import { setNotification } from '../../../redux/notificationSlice';
import { RootState } from '../../../redux/store';
import { AssociatedFile, FileRrs, FileType, FileVersion } from '../../../types/associatedArtifact.types';
import { CustomerRrsType } from '../../../types/customerInstitution.types';
import { licenses, LicenseUri } from '../../../types/license.types';
import { SpecificFileFieldNames } from '../../../types/publicationFieldNames';
import { Registration } from '../../../types/registration.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { activeLicenses, getLicenseData, hasFileAccessRight } from '../../../utils/fileHelpers';
import { isDegree, isOpenFile, isPendingOpenFile, userIsValidImporter } from '../../../utils/registration-helpers';
import { IdentifierParams } from '../../../utils/urlPaths';
import { DeleteIconButton } from '../../messages/components/DeleteIconButton';
import { FileUploaderInfo } from '../../public_registration/public_files/FileUploaderInfo';
import { DownloadFileButton } from './DownloadFileButton';

const StyledFileTypeMenuItemContent = styled('div')({
  display: 'flex',
  gap: '0.25rem',
  alignItems: 'center',
});

const VerticalAlignedTableCell = (props: TableCellProps) => (
  <TableCell style={{ verticalAlign: 'middle' }} {...props} />
);

interface FilesTableRowProps {
  file: AssociatedFile;
  removeFile: () => void;
  baseFieldName: string;
  showFileVersion: boolean;
  isRrsApplicableCategory: boolean;
  showAllColumns: boolean;
}

export const FilesTableRow = ({
  file,
  removeFile,
  baseFieldName,
  showFileVersion,
  isRrsApplicableCategory,
  showAllColumns,
}: FilesTableRowProps) => {
  const { t } = useTranslation();
  const { identifier } = useParams<IdentifierParams>();

  const dispatch = useDispatch();
  const { values } = useFormikContext<Registration>();

  const user = useSelector((state: RootState) => state.user);
  const customer = useSelector((state: RootState) => state.customer);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const toggleOpenConfirmDialog = () => setOpenConfirmDialog(!openConfirmDialog);
  const { setFieldValue, setFieldTouched, errors, touched } = useFormikContext<Registration>();

  const fileTypeFieldName = `${baseFieldName}.${SpecificFileFieldNames.Type}`;
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

  const [inactiveLicensesOpen, setInactiveLicensesOpen] = useState(false);
  const inactiveLicenses = licenses.filter((license) => license.version && license.version !== 4);

  const isCompletedFile = isOpenFile(file) || file.type === FileType.InternalFile;
  const isOpenableFile = isOpenFile(file) || isPendingOpenFile(file);

  const deleteFileMutation = useMutation({
    mutationFn: async () => {
      if (identifier) {
        if (values.type === 'Publication') {
          await deleteRegistrationFile(identifier, file.identifier);
        } else if (values.type === 'ImportCandidate') {
          await deleteImportCandidateFile(identifier, file.identifier);
        }
        removeFile();
        toggleOpenConfirmDialog();
      }
    },
    onSuccess: () => dispatch(setNotification({ message: t('feedback.success.delete_file'), variant: 'success' })),
    onError: () => dispatch(setNotification({ message: t('feedback.error.delete_file'), variant: 'error' })),
  });

  const canEditImportCandidateFile = userIsValidImporter(user, values);
  const canEditFile = hasFileAccessRight(file, 'write-metadata');
  const disabledFile = !canEditFile && !canEditImportCandidateFile;

  const canDeleteFile = hasFileAccessRight(file, 'delete') || canEditImportCandidateFile;
  const canDownloadFile = hasFileAccessRight(file, 'download') || canEditImportCandidateFile;

  const category = values.entityDescription?.reference?.publicationInstance?.type;
  const canUploadHiddenFile = isDegree(category) ? user?.isThesisCurator : user?.isPublishingCurator;

  const disabledFileDescription =
    disabledFile && file.type === 'OpenFile' ? t('registration.files_and_license.disabled_helper_text') : '';

  return (
    <>
      <TableRow
        data-testid={dataTestId.registrationWizard.files.fileRow}
        title={disabledFileDescription}
        sx={{
          bgcolor: disabledFile ? 'grey.400' : '',
          td: { verticalAlign: 'top', borderBottom: isOpenableFile ? 'unset' : '' },
        }}>
        <VerticalAlignedTableCell>
          <Box sx={{ display: 'flex', minWidth: '13rem', gap: '0.75rem', alignItems: 'center' }}>
            <InsertDriveFileOutlinedIcon sx={{ color: disabledFile ? 'grey.600' : '' }} />
            <Box sx={{ minWidth: '10rem' }}>
              <TruncatableTypography sx={{ fontWeight: 'bold', color: disabledFile ? 'grey.600' : '' }}>
                {file.name}
              </TruncatableTypography>
              <Typography sx={{ color: disabledFile ? 'grey.600' : '' }}>{prettyBytes(file.size)}</Typography>
              <FileUploaderInfo sx={{ color: disabledFile ? 'grey.600' : '' }} uploadDetails={file.uploadDetails} />
            </Box>
            {canDownloadFile && (
              <Box sx={{ minWidth: '1.5rem', ml: 'auto' }}>
                <DownloadFileButton file={file} registration={values} />
              </Box>
            )}
            {canDeleteFile && (
              <>
                <DeleteIconButton
                  data-testid={dataTestId.registrationWizard.files.deleteFile}
                  onClick={toggleOpenConfirmDialog}
                  tooltip={t('registration.files_and_license.delete_file')}
                />
                <ConfirmDialog
                  open={openConfirmDialog}
                  title={t('registration.files_and_license.delete_file')}
                  onAccept={() => deleteFileMutation.mutate()}
                  isLoading={deleteFileMutation.isPending}
                  onCancel={toggleOpenConfirmDialog}>
                  <Typography>
                    {t('registration.files_and_license.delete_file_description', { fileName: file.name })}
                  </Typography>
                </ConfirmDialog>
              </>
            )}
          </Box>
        </VerticalAlignedTableCell>
        <VerticalAlignedTableCell>
          <Field name={fileTypeFieldName}>
            {({ field, meta: { error, touched } }: FieldProps<FileType>) => (
              <TextField
                {...field}
                data-testid={dataTestId.registrationWizard.files.fileTypeSelect}
                select
                disabled={disabledFile}
                variant="filled"
                fullWidth
                onChange={(event) => {
                  const newValue = event.target.value as FileType;
                  // Ensure new file type is not directly set to a completed file type
                  if (newValue === FileType.OpenFile) {
                    setFieldValue(fileTypeFieldName, FileType.PendingOpenFile);
                  } else if (newValue === FileType.InternalFile) {
                    setFieldValue(fileTypeFieldName, FileType.PendingInternalFile);
                  } else {
                    setFieldValue(fileTypeFieldName, newValue);
                  }
                }}
                error={!!error && touched}
                helperText={<ErrorMessage name={field.name} />}
                slotProps={{
                  input: { sx: { '.MuiSelect-select': { py: '0.75rem' } } },
                  select: { inputProps: { 'aria-label': t('registration.files_and_license.availability') } },
                }}>
                {field.value === FileType.UpdloadedFile && (
                  <MenuItem value={FileType.UpdloadedFile} disabled hidden>
                    <i>{t('registration.files_and_license.select_availability')}</i>
                  </MenuItem>
                )}
                <MenuItem value={isCompletedFile ? FileType.OpenFile : FileType.PendingOpenFile}>
                  <StyledFileTypeMenuItemContent>
                    <CheckIcon fontSize="small" />
                    {t('registration.files_and_license.file_type.open_file')}
                  </StyledFileTypeMenuItemContent>
                </MenuItem>
                <MenuItem value={isCompletedFile ? FileType.InternalFile : FileType.PendingInternalFile}>
                  <StyledFileTypeMenuItemContent>
                    <Inventory2OutlinedIcon fontSize="small" />
                    {t('registration.files_and_license.file_type.internal_file')}
                  </StyledFileTypeMenuItemContent>
                </MenuItem>
                {(canUploadHiddenFile || field.value === FileType.HiddenFile) && (
                  <MenuItem value={FileType.HiddenFile}>
                    <StyledFileTypeMenuItemContent>
                      <VisibilityOffOutlinedIcon fontSize="small" />
                      {t('registration.files_and_license.file_type.hidden_file')}
                    </StyledFileTypeMenuItemContent>
                  </MenuItem>
                )}
                {field.value === FileType.RejectedFile && (
                  <MenuItem value={FileType.RejectedFile} disabled>
                    <StyledFileTypeMenuItemContent>
                      <BlockIcon fontSize="small" />
                      {t('registration.files_and_license.file_type.rejected_file')}
                    </StyledFileTypeMenuItemContent>
                  </MenuItem>
                )}
              </TextField>
            )}
          </Field>
        </VerticalAlignedTableCell>
        {showAllColumns && (
          <>
            {showFileVersion && (
              <VerticalAlignedTableCell>
                {isOpenableFile && (
                  <Field name={publisherVersionFieldName}>
                    {({ field, meta: { error, touched } }: FieldProps<FileVersion | null>) => (
                      <FormControl
                        data-testid={dataTestId.registrationWizard.files.version}
                        required
                        disabled={disabledFile}>
                        <RadioGroup
                          {...field}
                          row
                          sx={{ flexWrap: 'nowrap' }}
                          onChange={(event) => {
                            const fileVersion = event.target.value as FileVersion;
                            setFieldValue(field.name, fileVersion);

                            if (isRrsApplicableCategory) {
                              if (fileVersion === FileVersion.Published) {
                                const nullRrsValue: FileRrs = {
                                  type: 'NullRightsRetentionStrategy',
                                  configuredType: rrsStrategy,
                                };
                                setFieldValue(rrsFieldName, nullRrsValue);
                                if (field.value === FileVersion.Accepted) {
                                  setFieldValue(licenseFieldName, null);
                                }
                              } else if (isCustomerRrs || isOverridableRrs) {
                                const customerRrsValue: FileRrs = {
                                  type: 'CustomerRightsRetentionStrategy',
                                  configuredType: rrsStrategy,
                                };
                                setFieldValue(rrsFieldName, customerRrsValue);
                                setFieldValue(licenseFieldName, LicenseUri.CC_BY_4);
                              }
                            }
                          }}>
                          <FormControlLabel
                            value={FileVersion.Accepted}
                            control={<Radio />}
                            label={
                              <Typography variant="caption" sx={{ lineHeight: '1.1rem' }}>
                                {t('registration.files_and_license.accepted_version')}
                              </Typography>
                            }
                          />
                          <FormControlLabel
                            value={FileVersion.Published}
                            control={<Radio />}
                            label={
                              <Typography variant="caption" sx={{ lineHeight: '1.1rem' }}>
                                {t('registration.files_and_license.published_version')}
                              </Typography>
                            }
                          />
                        </RadioGroup>
                        {error && touched && <FormHelperText error>{error}</FormHelperText>}
                      </FormControl>
                    )}
                  </Field>
                )}
              </VerticalAlignedTableCell>
            )}
            <VerticalAlignedTableCell sx={{ maxWidth: '20rem' }}>
              {isOpenableFile && (
                <>
                  <Field name={licenseFieldName}>
                    {({ field, meta: { error, touched } }: FieldProps<string>) => (
                      <TextField
                        id={field.name}
                        data-testid={dataTestId.registrationWizard.files.selectLicenseField}
                        select
                        fullWidth
                        disabled={disabledFile}
                        slotProps={{
                          select: {
                            renderValue: (option) => {
                              const selectedLicense = getLicenseData(option as string);

                              return selectedLicense ? (
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                  }}>
                                  {selectedLicense.logo && (
                                    <img style={{ width: '5rem' }} src={selectedLicense.logo} alt="" />
                                  )}
                                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {selectedLicense.name}
                                  </span>
                                </Box>
                              ) : null;
                            },
                          },
                        }}
                        variant="filled"
                        value={getLicenseData(field.value)?.id ?? ''}
                        error={!!error && touched}
                        helperText={<ErrorMessage name={field.name} />}
                        label={t('registration.files_and_license.conditions_for_using_file')}
                        required
                        onChange={({ target: { value } }) => setFieldValue(field.name, value)}>
                        {activeLicenses.map((license) => (
                          <MenuItem
                            data-testid={dataTestId.registrationWizard.files.licenseItem}
                            key={license.id}
                            value={license.id}
                            divider
                            dense
                            sx={{ gap: '1rem' }}>
                            <ListItemIcon>
                              <img style={{ width: '5rem' }} src={license.logo} alt="" />
                            </ListItemIcon>
                            <ListItemText>
                              <Typography>{license.name}</Typography>
                            </ListItemText>
                          </MenuItem>
                        ))}
                        {!inactiveLicensesOpen && (
                          <MenuItem
                            data-testid={dataTestId.registrationWizard.files.licenseItemShowOlderVersion}
                            sx={{ display: 'flex', justifyContent: 'center' }}
                            onClickCapture={(e) => {
                              e.stopPropagation();
                              setInactiveLicensesOpen(!inactiveLicensesOpen);
                            }}>
                            <Typography sx={{ fontStyle: 'italic' }}>
                              {t('registration.files_and_license.show_all_older_versions')}
                            </Typography>
                          </MenuItem>
                        )}
                        {inactiveLicenses.map((license) => (
                          <MenuItem
                            data-testid={dataTestId.registrationWizard.files.licenseItem}
                            key={license.id}
                            value={license.id}
                            divider
                            dense
                            sx={{ gap: '1rem', display: inactiveLicensesOpen ? 'flex' : 'none' }}>
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
                  {isRrsApplicableCategory && isAcceptedFile && canEditFile && (
                    <>
                      {fileHasCustomerRrs && (
                        <Typography>
                          <Trans i18nKey="registration.files_and_license.institution_prefers_cc_by">
                            {rrsPolicyLink}
                          </Trans>
                        </Typography>
                      )}
                      {fileHasOverriddenRrs && (
                        <Typography>
                          <Trans i18nKey="registration.files_and_license.opted_out_of_rrs">{rrsPolicyLink}</Trans>
                        </Typography>
                      )}
                    </>
                  )}
                </>
              )}
            </VerticalAlignedTableCell>
            <VerticalAlignedTableCell>
              {isOpenableFile && (
                <IconButton
                  title={openCollapsable ? t('common.show_fewer_options') : t('common.show_more_options')}
                  onClick={() => setOpenCollapsable(!openCollapsable)}
                  data-testid={dataTestId.registrationWizard.files.expandFileRowButton}>
                  {openCollapsable ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
              )}
            </VerticalAlignedTableCell>
          </>
        )}
      </TableRow>
      {isOpenableFile && (
        <TableRow sx={{ bgcolor: disabledFile ? 'grey.400' : '' }} title={disabledFileDescription}>
          <TableCell sx={{ pt: 0, pb: 0 }} colSpan={showFileVersion ? 6 : 5}>
            <Collapse in={openCollapsable}>
              <Box sx={{ m: '1rem', display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {isRrsApplicableCategory && (
                    <>
                      {isAcceptedFile && isNullRrs && (
                        <FormControlLabel
                          label={t('registration.files_and_license.mark_if_funder_requires_rrs')}
                          disabled={disabledFile}
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
                          disabled={disabledFile}
                          label={
                            <Trans i18nKey="registration.files_and_license.follow_institution_rights_policy">
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
                    </>
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
                          label={t('registration.files_and_license.public_note')}
                          multiline
                          disabled={disabledFile}
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
                        maxDate={new Date(new Date().getFullYear() + 5, 11, 31)}
                        disabled={disabledFile}
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
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
                    <Paper sx={{ p: '1rem' }}>
                      <Typography>{t('registration.files_and_license.file_publish_date_helper_text')}</Typography>
                    </Paper>
                  </Popover>
                </Box>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};
