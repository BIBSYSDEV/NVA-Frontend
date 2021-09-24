import { ErrorMessage, Field, FieldProps, useFormikContext } from 'formik';
import prettyBytes from 'pretty-bytes';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
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
} from '@mui/material';
import ListItemIcon from '@mui/material/ListItemIcon';
import DeleteIcon from '@mui/icons-material/Delete';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { DatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { BackgroundDiv } from '../../../components/BackgroundDiv';
import { lightTheme, datePickerTranslationProps } from '../../../themes/lightTheme';
import { File, LicenseNames, licenses } from '../../../types/file.types';
import { SpecificFileFieldNames } from '../../../types/publicationFieldNames';
import { getDateFnsLocale } from '../../../utils/date-helpers';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { dataTestId } from '../../../utils/dataTestIds';

const StyledDescription = styled(Typography)`
  font-style: italic;
`;

const StyledLicenseOptionImage = styled.img`
  width: 70%;
`;

const StyledLicenseValue = styled.div`
  display: flex;
  align-items: center;
  span:last-child {
    margin-left: 0.75rem;
  }
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
  grid-template-columns: 10fr 1fr;
  column-gap: 0.5rem;
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.values.md + 'px'}) {
    grid-template-columns: 4fr 1fr;
  }
`;

const StyledAdministrativeContract = styled(FormControlLabel)`
  margin-top: 2rem;
`;

const StyledActionsContainer = styled.div`
  display: flex;
  justify-content: end;
`;

interface FileCardProps {
  file: File;
  removeFile: () => void;
  baseFieldName?: string;
  toggleLicenseModal?: () => void;
}

export const FileCard = ({ file, removeFile, baseFieldName, toggleLicenseModal }: FileCardProps) => {
  const { t, i18n } = useTranslation('registration');
  const { setFieldValue, setFieldTouched } = useFormikContext();
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
          <div>
            <Field name={`${baseFieldName}.${SpecificFileFieldNames.PublisherAuthority}`}>
              {({ field, meta: { error, touched } }: FieldProps) => (
                <FormControl
                  data-testid={dataTestId.registrationWizard.files.version}
                  required
                  disabled={file.administrativeAgreement}>
                  <FormLabel component="legend">{t('files_and_license.version')}</FormLabel>
                  <RadioGroup
                    {...field}
                    onChange={(event) => setFieldValue(field.name, JSON.parse(event.target.value))}>
                    <FormControlLabel
                      value={false}
                      control={<Radio color="primary" />}
                      label={t('files_and_license.accepted_version')}
                    />
                    <FormControlLabel
                      value={true}
                      control={<Radio color="primary" />}
                      label={t('files_and_license.published_version')}
                    />
                  </RadioGroup>
                  {error && touched && <FormHelperText error>{error}</FormHelperText>}
                </FormControl>
              )}
            </Field>

            <Field name={`${baseFieldName}.${SpecificFileFieldNames.AdministrativeAgreement}`}>
              {({ field }: FieldProps) => (
                <StyledAdministrativeContract
                  data-testid={dataTestId.registrationWizard.files.administrativeAgreement}
                  control={<Checkbox {...field} color="primary" checked={field.value} />}
                  label={t('files_and_license.administrative_contract')}
                />
              )}
            </Field>
          </div>

          <div>
            <StyledInputRow>
              <Field name={`${baseFieldName}.${SpecificFileFieldNames.EmbargoDate}`}>
                {({ field, meta: { error, touched } }: FieldProps) => (
                  <LocalizationProvider dateAdapter={AdapterDateFns} locale={getDateFnsLocale(i18n.language)}>
                    <DatePicker
                      {...datePickerTranslationProps}
                      {...field}
                      data-testid="date-published-field"
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
            </StyledInputRow>

            <StyledInputRow>
              <Field name={`${baseFieldName}.${SpecificFileFieldNames.License}`}>
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
                          <StyledLicenseValue>
                            <img src={selectedLicense.buttonImage} alt={selectedLicense.identifier} />
                            <span>{option}</span>
                          </StyledLicenseValue>
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
                          <StyledLicenseOptionImage src={license.buttonImage} alt={license.identifier} />
                        </ListItemIcon>
                        <ListItemText>
                          <Typography>{license.identifier}</Typography>
                        </ListItemText>
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              </Field>
              <Tooltip title={t<string>('common:help')}>
                <IconButton data-testid="button-toggle-license-modal" onClick={toggleLicenseModal} size="large">
                  <HelpOutlineIcon fontSize="large" />
                </IconButton>
              </Tooltip>
            </StyledInputRow>
          </div>
        </StyledCardContent>
      )}
      <StyledActionsContainer>
        <Button
          color="error"
          variant="contained"
          data-testid="button-remove-file"
          startIcon={<DeleteIcon />}
          onClick={toggleOpenConfirmDialog}>
          {t('files_and_license.remove_file')}
        </Button>
      </StyledActionsContainer>

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
