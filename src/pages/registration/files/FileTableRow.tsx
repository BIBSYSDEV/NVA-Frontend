import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
  Box,
  Checkbox,
  Collapse,
  FormControlLabel,
  IconButton,
  Link as MuiLink,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Popover,
  TableCell,
  TableCellProps,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { ErrorMessage, Field, FieldProps, getIn, useFormikContext } from 'formik';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { AssociatedFile, FileRrs, FileType, FileVersion } from '../../../types/associatedArtifact.types';
import { CustomerRrsType } from '../../../types/customerInstitution.types';
import { licenses, LicenseUri } from '../../../types/license.types';
import { SpecificFileFieldNames } from '../../../types/publicationFieldNames';
import { Registration } from '../../../types/registration.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { equalUris } from '../../../utils/general-helpers';
import { useFileTableColumnWidths } from '../../../utils/hooks/useFileTableColumnWidths';
import {
  isDegree,
  isEmbargoed,
  isTypeWithFileVersionField,
  isTypeWithRrs,
  userCanUnpublishRegistration,
} from '../../../utils/registration-helpers';
import { FileInfo } from './FileInfo';
import { PublishCheck } from './PublishCheck';
import { VersionRadio } from './VersionRadio';

export const markForPublishId = 'mark-for-publish';

const VerticalAlignedTableCell = (props: TableCellProps) => (
  <TableCell style={{ verticalAlign: 'middle' }} {...props} />
);

interface FilesTableRowProps {
  file: AssociatedFile;
  removeFile: () => void;
  baseFieldName: string;
  archived?: boolean;
}

export const FileTableRow = ({ file, removeFile, baseFieldName, archived }: FilesTableRowProps) => {
  const { t } = useTranslation();
  const { values } = useFormikContext<Registration>();
  const user = useSelector((state: RootState) => state.user);
  const customer = useSelector((state: RootState) => state.customer);

  const { setFieldValue, setFieldTouched, errors, touched } = useFormikContext<Registration>();
  const columnWidths = useFileTableColumnWidths(archived);

  console.log('columnWidths', columnWidths);

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
  const activeLicenses = licenses.filter(
    (license) => license.version === 4 || license.id === LicenseUri.CC0 || license.id === LicenseUri.RightsReserved
  );
  const inactiveLicenses = licenses.filter((license) => license.version && license.version !== 4);

  const publicationInstanceType = values.entityDescription?.reference?.publicationInstance?.type;
  const isProtectedDegree = isDegree(publicationInstanceType);

  function canEditFile(file: AssociatedFile) {
    if (isProtectedDegree && isEmbargoed(file.embargoDate)) {
      return !!user?.isEmbargoThesisCurator;
    }

    if (isProtectedDegree) {
      return !!user?.isThesisCurator;
    }

    if (values.type === 'ImportCandidate') {
      return !!user?.isInternalImporter;
    }

    if (file.type === FileType.PublishedFile) {
      return userCanUnpublishRegistration(values) ?? false;
    }

    return true;
  }

  const disabled = !canEditFile(file);

  const showFileVersion = isTypeWithFileVersionField(publicationInstanceType);
  const showRrs = isTypeWithRrs(publicationInstanceType);

  return (
    <>
      <TableRow
        data-testid={dataTestId.registrationWizard.files.fileRow}
        title={disabled ? t('registration.files_and_license.disabled_helper_text') : ''}
        sx={{ bgcolor: disabled ? 'grey.400' : '' }}>
        <VerticalAlignedTableCell sx={{ minWidth: columnWidths.nameColumn + '%' }}>
          <FileInfo disabled={disabled} file={file} removeFile={removeFile} />
        </VerticalAlignedTableCell>
        <VerticalAlignedTableCell sx={{ width: columnWidths.publishColumn + '%' }}>
          <PublishCheck disabled={disabled} baseFieldName={baseFieldName} />
        </VerticalAlignedTableCell>
        {!archived && (
          <>
            {showFileVersion && (
              <VerticalAlignedTableCell sx={{ width: columnWidths.versionColumn + '%' }}>
                <VersionRadio disabled={disabled} baseFieldName={baseFieldName} rrsStrategy={rrsStrategy} />
              </VerticalAlignedTableCell>
            )}
            <VerticalAlignedTableCell sx={{ width: columnWidths.licenseColumn + '%' }}>
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
                    {activeLicenses.map((license) => (
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
              {showRrs && (
                <>
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
                </>
              )}
            </VerticalAlignedTableCell>
          </>
        )}
        <VerticalAlignedTableCell sx={{ width: columnWidths.iconColumn + '%' }}>
          {!archived && (
            <IconButton
              onClick={() => setOpenCollapsable(!openCollapsable)}
              data-testid={dataTestId.registrationWizard.files.expandFileRowButton}>
              {openCollapsable ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          )}
        </VerticalAlignedTableCell>
      </TableRow>
      {!archived && (
        <TableRow
          sx={{ bgcolor: disabled ? 'grey.400' : '' }}
          title={disabled ? t('registration.files_and_license.disabled_helper_text') : ''}>
          <TableCell sx={{ pt: 0, pb: 0 }} colSpan={showFileVersion ? 6 : 5}>
            <Collapse in={openCollapsable}>
              <Box
                sx={{
                  m: '1rem',
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: '2rem',
                }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {showRrs && (
                    <>
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
                          disabled={disabled}
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
                        maxDate={new Date(new Date().getFullYear() + 5, 11, 31)}
                        disabled={disabled}
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
          </TableCell>
        </TableRow>
      )}
    </>
  );
};
