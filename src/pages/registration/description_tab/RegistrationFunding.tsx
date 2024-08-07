import AddIcon from '@mui/icons-material/AddCircleOutlineSharp';
import CancelIcon from '@mui/icons-material/Cancel';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Box, Button, IconButton, InputAdornment, SxProps, TextField, Typography } from '@mui/material';
import { ErrorMessage, Field, FieldArray, FieldArrayRenderProps, FieldProps } from 'formik';
import { Trans, useTranslation } from 'react-i18next';
import { VerifiedFundingApiPath } from '../../../api/apiPaths';
import { FundingSourceField } from '../../../components/FundingSourceField';
import { NfrProjectSearch } from '../../../components/NfrProjectSearch';
import { DescriptionFieldNames, SpecificFundingFieldNames } from '../../../types/publicationFieldNames';
import { Funding, emptyFunding } from '../../../types/registration.types';
import { API_URL } from '../../../utils/constants';
import { dataTestId } from '../../../utils/dataTestIds';
import { getLanguageString } from '../../../utils/translation-helpers';
import { HelperTextModal } from '../HelperTextModal';
import { fundingSourceIsNfr, getNfrProjectUrl } from './projects_field/projectHelpers';

interface FundingsFieldProps {
  currentFundings: Funding[];
}

const getTextFieldMargin = (isError: boolean): SxProps => ({
  mt: isError ? '1.5rem' : 0,
});

export const RegistrationFunding = ({ currentFundings }: FundingsFieldProps) => {
  const { t } = useTranslation();

  return (
    <div>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="h2">{t('common.funding')}</Typography>
        <HelperTextModal
          modalTitle={t('common.funding')}
          modalDataTestId={dataTestId.registrationWizard.description.fundingModal}>
          <Trans
            i18nKey="registration.description.funding.funding_helper_text"
            components={[<Typography paragraph key="1" />]}
          />
        </HelperTextModal>
      </Box>

      <FieldArray name={DescriptionFieldNames.Fundings}>
        {({ name, remove, push, form: { setFieldValue } }: FieldArrayRenderProps) => (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: '1rem', md: '0.5rem' } }}>
            {currentFundings.map((funding, index) => {
              const baseFieldName = `${name}[${index}]`;
              const hasSelectedSource = !!funding.source;
              const hasSelectedNfrSource = fundingSourceIsNfr(funding.source);
              let fundingId = funding.id ?? '';
              if (hasSelectedNfrSource && !fundingId && funding.identifier) {
                // TODO: Remove this when(/if) NP-43030 is solved
                fundingId = `${API_URL}${VerifiedFundingApiPath.Nfr.substring(1)}/${funding.identifier}`;
              }

              const hasSelectedNfrProject = hasSelectedNfrSource && !!fundingId;

              return (
                <Box
                  key={index}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '4fr 6fr 2fr 2fr 1fr' },
                    gap: '0.5rem 1rem',
                    alignItems: 'center',
                  }}>
                  <FundingSourceField fieldName={`${baseFieldName}.${SpecificFundingFieldNames.Source}`} />

                  {hasSelectedNfrSource &&
                    (hasSelectedNfrProject ? (
                      <>
                        <Field name={`${baseFieldName}.${SpecificFundingFieldNames.NorwegianLabel}`}>
                          {({ field, meta: { touched, error } }: FieldProps<string>) => (
                            <TextField
                              value={getLanguageString(funding.labels)}
                              disabled
                              label={t('registration.description.funding.funding_name')}
                              fullWidth
                              variant="filled"
                              multiline
                              sx={getTextFieldMargin(touched && !!error)}
                              error={touched && !!error}
                              helperText={<ErrorMessage name={field.name} />}
                              data-testid={dataTestId.registrationWizard.description.fundingProjectField}
                            />
                          )}
                        </Field>
                        <TextField
                          value={funding.identifier}
                          disabled={hasSelectedNfrSource}
                          label={t('registration.description.funding.funding_id')}
                          fullWidth
                          variant="filled"
                          data-testid={dataTestId.registrationWizard.description.fundingIdField}
                        />
                        {funding.identifier && (
                          <Button
                            variant="outlined"
                            endIcon={<OpenInNewIcon />}
                            href={getNfrProjectUrl(funding.identifier)}
                            target="_blank"
                            data-testid={dataTestId.registrationWizard.description.fundingLinkButton}
                            rel="noopener noreferrer">
                            {t('common.open')}
                          </Button>
                        )}
                      </>
                    ) : (
                      <Field name={`${baseFieldName}.${SpecificFundingFieldNames.Id}`}>
                        {({ field: { name, onBlur }, meta: { touched, error } }: FieldProps<string>) => (
                          <NfrProjectSearch
                            onSelectProject={(project) => {
                              if (project) {
                                const { lead, ...rest } = project;
                                const nfrFunding: Funding = {
                                  type: 'ConfirmedFunding',
                                  ...rest,
                                };
                                setFieldValue(baseFieldName, nfrFunding);
                              }
                            }}
                            required
                            name={name}
                            onBlur={onBlur}
                            sx={getTextFieldMargin(touched && !!error)}
                            errorMessage={touched && !!error ? error : undefined}
                            data-testid={dataTestId.registrationWizard.description.fundingNfrProjectSearchField}
                          />
                        )}
                      </Field>
                    ))}

                  {!hasSelectedNfrSource && hasSelectedSource && (
                    <>
                      <Field name={`${baseFieldName}.${SpecificFundingFieldNames.NorwegianLabel}`}>
                        {({ field, meta: { touched, error } }: FieldProps<string>) => (
                          <TextField
                            {...field}
                            value={field.value ?? ''}
                            disabled={hasSelectedNfrSource}
                            label={t('registration.description.funding.funding_name')}
                            fullWidth
                            variant="filled"
                            multiline
                            required={!hasSelectedNfrSource}
                            sx={getTextFieldMargin(touched && !!error)}
                            error={touched && !!error}
                            helperText={touched && !!error ? error : undefined}
                            data-testid={dataTestId.registrationWizard.description.fundingProjectField}
                          />
                        )}
                      </Field>

                      <Field name={`${baseFieldName}.${SpecificFundingFieldNames.Identifier}`}>
                        {({ field }: FieldProps<string>) => (
                          <TextField
                            {...field}
                            value={field.value ?? ''}
                            disabled={hasSelectedNfrSource}
                            label={t('registration.description.funding.funding_id')}
                            fullWidth
                            variant="filled"
                            data-testid={dataTestId.registrationWizard.description.fundingIdField}
                          />
                        )}
                      </Field>

                      <Field name={`${baseFieldName}.${SpecificFundingFieldNames.Amount}`}>
                        {({ field, meta: { error, touched } }: FieldProps<number>) => (
                          <TextField
                            {...field}
                            disabled={hasSelectedNfrSource}
                            label={t('registration.description.funding.funding_sum')}
                            fullWidth
                            variant="filled"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">{funding.fundingAmount?.currency}</InputAdornment>
                              ),
                            }}
                            sx={getTextFieldMargin(touched && !!error)}
                            error={touched && !!error}
                            helperText={touched && !!error ? error : undefined}
                            data-testid={dataTestId.registrationWizard.description.fundingSumField}
                          />
                        )}
                      </Field>
                    </>
                  )}
                  <IconButton
                    onClick={() => remove(index)}
                    data-testid={dataTestId.registrationWizard.description.fundingRemoveButton}
                    title={t('registration.description.funding.remove_funding')}
                    sx={{
                      width: 'fit-content',
                    }}>
                    <CancelIcon color="primary" />
                  </IconButton>
                </Box>
              );
            })}
            <Button
              sx={{ width: 'fit-content' }}
              data-testid={dataTestId.registrationWizard.description.addFundingButton}
              startIcon={<AddIcon />}
              onClick={() => push(emptyFunding)}>
              {t('common.add_custom', { name: t('common.funding').toLocaleLowerCase() })}
            </Button>
          </Box>
        )}
      </FieldArray>
    </div>
  );
};
