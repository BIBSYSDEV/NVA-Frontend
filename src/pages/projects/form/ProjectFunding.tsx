import { Box, Button, IconButton, TextField, Typography } from '@mui/material';
import { Field, FieldArray, FieldArrayRenderProps, FieldProps } from 'formik';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/AddCircleOutlineSharp';
import CancelIcon from '@mui/icons-material/Cancel';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { VerifiedFundingApiPath } from '../../../api/apiPaths';
import { emptyFunding, Funding } from '../../../types/registration.types';
import { SpecificFundingFieldNames } from '../../../types/publicationFieldNames';
import { NfrProjectSearch } from '../../../components/NfrProjectSearch';
import { dataTestId } from '../../../utils/dataTestIds';
import { API_URL } from '../../../utils/constants';
import { fundingSourceIsNfr, getNfrProjectUrl } from '../../registration/description_tab/projects_field/projectHelpers';
import { ProjectFieldName } from './ProjectFormDialog';
import { FundingSourceField } from '../../../components/FundingSourceField';

interface FundingsFieldProps {
  currentFundings: Funding[];
}

export const ProjectFundingsField = ({ currentFundings }: FundingsFieldProps) => {
  const { t } = useTranslation();

  return (
    <div>
      <Typography variant="h2" gutterBottom>
        {t('registration.description.funding.financing')}
      </Typography>

      <FieldArray name={ProjectFieldName.Funding}>
        {({ name, remove, push, form: { setFieldValue } }: FieldArrayRenderProps) => (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {currentFundings.map((funding, index) => {
              const baseFieldName = `${name}[${index}]`;
              const hasSelectedSource = !!funding.source;
              const hasSelectedNfrSource = fundingSourceIsNfr(funding.source);
              let fundingId = funding.id ?? '';
              if (hasSelectedNfrSource && !fundingId && funding.identifier) {
                // TODO: Remove this when(/if) NP-43030 is solved
                fundingId = `${API_URL}${VerifiedFundingApiPath.Nfr.substring(1)}/${funding.identifier}`;
              }

              const hasSelectedNfrProject = hasSelectedNfrSource && fundingId;

              return (
                <Box
                  key={index}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '4fr 5fr 2fr 1fr' },
                    gap: '1rem',
                    alignItems: 'center',
                  }}>
                  <FundingSourceField fieldName={`${baseFieldName}.${SpecificFundingFieldNames.Source}`} />

                  {hasSelectedNfrSource &&
                    (hasSelectedNfrProject ? (
                      <>
                        <TextField
                          value={funding.identifier}
                          disabled={hasSelectedNfrSource}
                          label={t('common.id')}
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
                            name={name}
                            onBlur={onBlur}
                            errorMessage={touched && !!error ? error : undefined}
                            data-testid={dataTestId.registrationWizard.description.fundingNfrProjectSearchField}
                          />
                        )}
                      </Field>
                    ))}

                  {!hasSelectedNfrSource && hasSelectedSource && (
                    <Field name={`${baseFieldName}.${SpecificFundingFieldNames.Identifier}`}>
                      {({ field }: FieldProps<string>) => (
                        <TextField
                          {...field}
                          value={field.value ?? ''}
                          disabled={hasSelectedNfrSource}
                          label={t('common.id')}
                          fullWidth
                          variant="filled"
                          data-testid={dataTestId.registrationWizard.description.fundingIdField}
                        />
                      )}
                    </Field>
                  )}
                  <IconButton
                    sx={{ width: 'fit-content' }}
                    onClick={() => remove(index)}
                    data-testid={dataTestId.registrationWizard.description.fundingRemoveButton}
                    title={t('registration.description.funding.remove_funding')}>
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
              {t('common.add')}
            </Button>
          </Box>
        )}
      </FieldArray>
    </div>
  );
};
