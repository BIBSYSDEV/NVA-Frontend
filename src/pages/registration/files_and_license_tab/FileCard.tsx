import { ErrorMessage, Field, FieldProps, useFormikContext } from 'formik';
import prettyBytes from 'pretty-bytes';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import DateFnsUtils from '@date-io/date-fns';
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  ListItemText,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import DeleteIcon from '@material-ui/icons/Delete';
import HelpIcon from '@material-ui/icons/Help';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import BackgroundDiv from '../../../components/BackgroundDiv';
import DangerButton from '../../../components/DangerButton';
import lightTheme, { datePickerTranslationProps } from '../../../themes/lightTheme';
import { File, LicenseNames, licenses } from '../../../types/file.types';
import { SpecificFileFieldNames } from '../../../types/publicationFieldNames';
import { getDateFnsLocale } from '../../../utils/date-helpers';
import ConfirmDialog from '../../../components/ConfirmDialog';

const StyledDescription = styled(Typography)`
  font-style: italic;
`;

const StyledLicenseOptionImage = styled.img`
  width: 70%;
`;

const StyledLicenseName = styled(Typography)`
  margin-left: 0.5rem;
`;

const StyledLicenseOptionName = styled(Typography)`
  margin-left: -1.5rem;
`;

const StyledVerticalAlign = styled.div`
  display: flex;
  align-items: center;
`;

const StyledTypography = styled(Typography)`
  overflow-wrap: break-word;
`;

const StyledCardContent = styled.div`
  margin: 1rem 0;
  display: grid;
  grid-template-columns: 2fr 3fr;
  column-gap: 1rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.values.md + 'px'}) {
    grid-template-columns: 1fr;
  }
`;

const StyledInputRow = styled.div`
  display: grid;
  grid-template-columns: 7fr 1fr;
  column-gap: 1rem;
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.values.md + 'px'}) {
    grid-template-columns: 4fr 1fr;
  }
`;

interface FileCardProps {
  file: File;
  removeFile: () => void;
  baseFieldName?: string;
  toggleLicenseModal?: () => void;
}

const FileCard = ({ file, removeFile, baseFieldName, toggleLicenseModal }: FileCardProps) => {
  const { t, i18n } = useTranslation('registration');
  const { setFieldValue } = useFormikContext();
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const toggleOpenConfirmDialog = () => setOpenConfirmDialog(!openConfirmDialog);

  return (
    <BackgroundDiv backgroundColor={lightTheme.palette.section.megaLight} data-testid="uploaded-file-card">
      <StyledTypography variant="h5">{file.name}</StyledTypography>
      <StyledDescription>
        {t('files_and_license.uploaded_size', { size: prettyBytes(file.size, { locale: true }) })}
      </StyledDescription>

      {baseFieldName && (
        <StyledCardContent>
          <FormControl>
            <FormLabel component="legend">{t('files_and_license.select_version')}</FormLabel>
            <RadioGroup
              onChange={(event) => {
                const newValue = event.target.value;
                if (newValue === 'administrative') {
                  setFieldValue(`${baseFieldName}.${SpecificFileFieldNames.ADMINISTRATIVE_AGREEMENT}`, true);
                  setFieldValue(`${baseFieldName}.${SpecificFileFieldNames.PUBLISHER_AUTHORITY}`, false);
                } else {
                  setFieldValue(`${baseFieldName}.${SpecificFileFieldNames.ADMINISTRATIVE_AGREEMENT}`, false);
                  setFieldValue(
                    `${baseFieldName}.${SpecificFileFieldNames.PUBLISHER_AUTHORITY}`,
                    event.target.value === 'published'
                  );
                }
              }}>
              <FormControlLabel
                value="accepted"
                control={<Radio color="primary" checked={!file.publisherAuthority && !file.administrativeAgreement} />}
                label={t('files_and_license.accepted_version')}
              />
              <FormControlLabel
                value="published"
                control={<Radio color="primary" checked={file.publisherAuthority && !file.administrativeAgreement} />}
                label={t('files_and_license.published_version')}
              />
              <FormControlLabel
                value="administrative"
                control={<Radio color="primary" checked={file.administrativeAgreement} />}
                label={
                  <>
                    <Typography>{t('files_and_license.administrative_agreement')}</Typography>
                    <Typography variant="body2">
                      {t('files_and_license.administrative_agreement_description')}
                    </Typography>
                  </>
                }
              />
            </RadioGroup>
          </FormControl>

          <div>
            {!file.administrativeAgreement && (
              <>
                <StyledInputRow>
                  <Field name={`${baseFieldName}.${SpecificFileFieldNames.LICENSE}`}>
                    {({ field, meta: { error, touched } }: FieldProps) => (
                      <TextField
                        id={field.name}
                        data-testid="uploaded-file-select-license"
                        select
                        fullWidth
                        SelectProps={{
                          renderValue: (option: any) => {
                            const selectedLicense = licenses.find((license) => license.identifier === option);
                            return selectedLicense ? (
                              <StyledVerticalAlign>
                                <img src={selectedLicense.buttonImage} alt={selectedLicense.identifier} />
                                <StyledLicenseName>{option}</StyledLicenseName>
                              </StyledVerticalAlign>
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
                        }>
                        {licenses.map((license) => (
                          <MenuItem
                            data-testid="license-item"
                            key={license.identifier}
                            value={license.identifier}
                            divider
                            ContainerProps={{ 'aria-label': t('files_and_license.conditions_for_using_file') }}
                            dense>
                            <ListItemIcon>
                              <StyledLicenseOptionImage src={license.buttonImage} alt={license.identifier} />
                            </ListItemIcon>
                            <ListItemText>
                              <StyledLicenseOptionName>{license.identifier}</StyledLicenseOptionName>
                            </ListItemText>
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  </Field>
                  <Tooltip title={t<string>('common:help')}>
                    <IconButton data-testid="button-toggle-license-modal" onClick={toggleLicenseModal}>
                      <HelpIcon fontSize="large" />
                    </IconButton>
                  </Tooltip>
                </StyledInputRow>

                <StyledInputRow>
                  <MuiPickersUtilsProvider utils={DateFnsUtils} locale={getDateFnsLocale(i18n.language)}>
                    <Field name={`${baseFieldName}.${SpecificFileFieldNames.EMBARGO_DATE}`}>
                      {({ field, meta: { error, touched } }: FieldProps) => (
                        <KeyboardDatePicker
                          fullWidth
                          id={field.name}
                          {...datePickerTranslationProps}
                          DialogProps={{
                            'aria-labelledby': `${field.name}-label`,
                            'aria-label': t('files_and_license.embargo_date'),
                          }}
                          KeyboardButtonProps={{
                            'aria-labelledby': `${field.name}-label`,
                          }}
                          leftArrowButtonProps={{ 'aria-label': t('common:previous') }}
                          rightArrowButtonProps={{ 'aria-label': t('common:next') }}
                          data-testid="uploaded-file-embargo-date"
                          inputVariant="filled"
                          label={t('files_and_license.embargo_date')}
                          {...field}
                          onChange={(value) => setFieldValue(field.name, value)}
                          value={field.value ?? null}
                          disablePast
                          autoOk
                          format={'dd.MM.yyyy'}
                          error={!!error && touched}
                          helperText={<ErrorMessage name={field.name} />}
                        />
                      )}
                    </Field>
                  </MuiPickersUtilsProvider>
                </StyledInputRow>
              </>
            )}
          </div>
        </StyledCardContent>
      )}

      <DangerButton
        variant="contained"
        data-testid="button-remove-file"
        startIcon={<DeleteIcon />}
        onClick={toggleOpenConfirmDialog}>
        {t('files_and_license.remove_file')}
      </DangerButton>

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
    </BackgroundDiv>
  );
};

export default FileCard;
