import React, { FC } from 'react';
import styled from 'styled-components';
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  ListItemText,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
} from '@material-ui/core';
import { File, licenses, LicenseNames } from '../../../types/file.types';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { useTranslation } from 'react-i18next';
import Card from '../../../components/Card';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import HelpIcon from '@material-ui/icons/Help';
import SubHeading from '../../../components/SubHeading';
import DeleteIcon from '@material-ui/icons/Delete';
import Label from '../../../components/Label';
import { Field, FieldProps, ErrorMessage } from 'formik';
import { SpecificFileFieldNames } from '../../../types/publicationFieldNames';

const StyledDescription = styled.div`
  font-style: italic;
`;

const StyledFormControl = styled(FormControl)`
  width: 30%;
  margin-top: 1rem;

  @media (max-width: ${({ theme }) => `${theme.breakpoints.values.sm}px`}) {
    width: 100%;
  }
`;

const StyledFileInfo = styled.div`
  display: flex;
  justify-content: space-between;

  @media (max-width: ${({ theme }) => `${theme.breakpoints.values.sm}px`}) {
    flex-direction: column;
  }
`;

const StyledSelect = styled(TextField)`
  .MuiSelect-root {
    /* Ensure input height isn't expanded due to image content */
    height: 1.1875rem;
  }
`;

const StyledLicenseImage = styled.img`
  width: 40%;
`;

const StyledLicenseOptionImage = styled.img`
  width: 70%;
`;

const StyledLicenseName = styled(Label)`
  margin-left: 0.5rem;
`;

const StyledLicenseOptionName = styled(Label)`
  margin-left: -1.5rem;
`;

const StyledVerticalAlign = styled.div`
  display: flex;
  align-items: center;
  margin-top: -0.25rem;
`;

const StyledActions = styled.div`
  margin-top: 1rem;
`;

interface FileCardProps {
  file: File;
  removeFile: () => void;
  baseFieldName?: string;
  toggleLicenseModal?: () => void;
}

const FileCard: FC<FileCardProps> = ({ file, removeFile, baseFieldName, toggleLicenseModal }) => {
  const { t } = useTranslation('publication');

  return (
    <Card data-testid="uploaded-file-card">
      <SubHeading>{file.name}</SubHeading>
      <StyledDescription>
        {t('files_and_license.uploaded_size', { size: Math.round(file.size / 1000) })}
      </StyledDescription>

      {baseFieldName && (
        <>
          <Field name={`${baseFieldName}.${SpecificFileFieldNames.ADMINISTRATIVE_AGREEMENT}`}>
            {({ field }: FieldProps) => (
              <FormControlLabel
                control={<Checkbox color="primary" {...field} checked={field.value} />}
                label={t('files_and_license.administrative_contract')}
              />
            )}
          </Field>

          {!file.administrativeAgreement && (
            <StyledFileInfo>
              <Field name={`${baseFieldName}.${SpecificFileFieldNames.PUBLISHER_AUTHORITY}`}>
                {({ field, form }: FieldProps) => (
                  <StyledFormControl>
                    <FormLabel component="legend">{t('files_and_license.select_version')}</FormLabel>
                    <RadioGroup
                      aria-label="version"
                      {...field}
                      onChange={(event) => form.setFieldValue(field.name, event.target.value === 'published')}>
                      <FormControlLabel
                        value="accepted"
                        control={<Radio color="primary" checked={field.value !== null && !field.value} />}
                        label={t('files_and_license.accepted_version')}
                      />
                      <FormControlLabel
                        value="published"
                        control={<Radio color="primary" checked={field.value} />}
                        label={t('files_and_license.published_version')}
                      />
                    </RadioGroup>
                  </StyledFormControl>
                )}
              </Field>

              <StyledFormControl>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <Field name={`${baseFieldName}.${SpecificFileFieldNames.EMBARGO_DATE}`}>
                    {({ field, form, meta: { error, touched } }: FieldProps) => (
                      <KeyboardDatePicker
                        data-testid="uploaded-file-embargo-date"
                        inputVariant="outlined"
                        label={t('files_and_license.embargo_date')}
                        {...field}
                        onChange={(value) => form.setFieldValue(field.name, value)}
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
              </StyledFormControl>

              <StyledFormControl>
                <StyledVerticalAlign>
                  <Field name={`${baseFieldName}.${SpecificFileFieldNames.LICENSE}`}>
                    {({ field, form, meta: { error, touched } }: FieldProps) => (
                      <StyledSelect
                        data-testid="uploaded-file-select-license"
                        select
                        fullWidth
                        SelectProps={{
                          renderValue: (option: any) => {
                            const selectedLicense = licenses.find((license) => license.identifier === option);
                            return selectedLicense ? (
                              <StyledVerticalAlign>
                                <StyledLicenseImage
                                  src={selectedLicense.buttonImage}
                                  alt={selectedLicense.identifier}
                                />
                                <StyledLicenseName>{option}</StyledLicenseName>
                              </StyledVerticalAlign>
                            ) : null;
                          },
                        }}
                        variant="outlined"
                        value={field.value?.identifier || ''}
                        error={!!error && touched}
                        helperText={<ErrorMessage name={field.name} />}
                        label={t('files_and_license.license')}
                        onChange={({ target: { value } }) =>
                          form.setFieldValue(field.name, {
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
                            dense>
                            <ListItemIcon>
                              <StyledLicenseOptionImage src={license.buttonImage} alt={license.identifier} />
                            </ListItemIcon>
                            <ListItemText>
                              <StyledLicenseOptionName>{license.identifier}</StyledLicenseOptionName>
                            </ListItemText>
                          </MenuItem>
                        ))}
                      </StyledSelect>
                    )}
                  </Field>
                  <IconButton size="small" onClick={toggleLicenseModal}>
                    <HelpIcon />
                  </IconButton>
                </StyledVerticalAlign>
              </StyledFormControl>
            </StyledFileInfo>
          )}
        </>
      )}

      <StyledActions>
        <Button variant="contained" color="secondary" onClick={removeFile}>
          <DeleteIcon />
          {t('common:remove')}
        </Button>
      </StyledActions>
    </Card>
  );
};

export default FileCard;
