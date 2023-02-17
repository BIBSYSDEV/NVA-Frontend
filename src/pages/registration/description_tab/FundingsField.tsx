import { Autocomplete, Box, Button, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { Field, FieldArray, FieldArrayRenderProps, FieldProps, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/AddCircleOutlineSharp';
import CancelIcon from '@mui/icons-material/Cancel';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { CristinApiPath } from '../../../api/apiPaths';
import { AutocompleteTextField } from '../../../components/AutocompleteTextField';
import { FundingSources } from '../../../types/project.types';
import { emptyFunding, Funding, Registration } from '../../../types/registration.types';
import { useFetchResource } from '../../../utils/hooks/useFetchResource';
import { getLanguageString } from '../../../utils/translation-helpers';
import { getNfrProjectUrl } from './projects_field/projectHelpers';
import { fundingSourceIsNfr } from '../../../utils/registration-helpers';
import { DescriptionFieldNames, SpecificFundingFieldNames } from '../../../types/publicationFieldNames';
import { NfrProjectSearch } from '../../../components/NfrProjectSearch';

export const FundingsField = () => {
  const { t } = useTranslation();
  const { values, setFieldValue } = useFormikContext<Registration>();
  const [fundingSources, isLoadingFundingSources] = useFetchResource<FundingSources>(CristinApiPath.FundingSources);
  const fundingSourcesList = fundingSources?.sources ?? [];

  return (
    <FieldArray name={DescriptionFieldNames.Fundings}>
      {({ name, remove, push }: FieldArrayRenderProps) => (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h2">{t('registration.description.funding.financing')}</Typography>

            <Button startIcon={<AddIcon />} onClick={() => push(emptyFunding)}>
              {t('common.add')}
            </Button>
          </Box>

          {values.fundings.map((funding, index) => {
            const baseFieldName = `${name}[${index}]`;
            const hasSelectedSource = !!funding.source;
            const hasSelectedNfrSource = fundingSourceIsNfr(funding.source);
            const hasSelectedNfrProject = hasSelectedNfrSource && funding.id;

            return (
              <Box
                key={index}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: '4fr 6fr 2fr 2fr 1fr' },
                  gap: '1rem',
                  alignItems: 'start',
                }}>
                <Field name={`${baseFieldName}.${SpecificFundingFieldNames.Source}`}>
                  {({ field, meta: { touched, error } }: FieldProps<string>) => (
                    <Autocomplete
                      value={fundingSourcesList.find((source) => source.id === field.value) ?? null}
                      options={fundingSourcesList}
                      filterOptions={(options, state) => {
                        const filter = state.inputValue.toLocaleLowerCase();
                        return options.filter((option) => {
                          const names = Object.values(option.name).map((name) => name.toLocaleLowerCase());
                          const identifier = option.identifier.toLocaleLowerCase();
                          return identifier.includes(filter) || names.some((name) => name.includes(filter));
                        });
                      }}
                      renderOption={(props, option) => (
                        <li {...props} key={option.identifier}>
                          {getLanguageString(option.name)}
                        </li>
                      )}
                      disabled={!fundingSources || !!field.value}
                      getOptionLabel={(option) => getLanguageString(option.name)}
                      onChange={(_, value) => setFieldValue(field.name, value?.id)}
                      renderInput={(params) => (
                        <AutocompleteTextField
                          name={field.name}
                          onBlur={field.onBlur}
                          {...params}
                          label={t('registration.description.funding.funder')}
                          isLoading={isLoadingFundingSources}
                          placeholder={t('registration.description.funding.funder_filter')}
                          showSearchIcon={!field.value}
                          multiline
                          required
                          errorMessage={touched && !!error ? error : undefined}
                        />
                      )}
                    />
                  )}
                </Field>

                {hasSelectedNfrSource &&
                  (hasSelectedNfrProject ? (
                    <>
                      <TextField
                        value={getLanguageString(funding.labels)}
                        disabled
                        label={t('registration.description.funding.project')}
                        fullWidth
                        variant="filled"
                        multiline
                      />
                      <TextField
                        value={funding.identifier}
                        disabled={hasSelectedNfrSource}
                        label={t('common.id')}
                        fullWidth
                        variant="filled"
                      />
                      <Button
                        variant="outlined"
                        endIcon={<OpenInNewIcon />}
                        href={getNfrProjectUrl(funding.identifier)}
                        target="_blank"
                        rel="noopener noreferrer">
                        {t('common.open')}
                      </Button>
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
                          errorMessage={touched && !!error ? error : undefined}
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
                          label={t('registration.description.funding.project')}
                          fullWidth
                          variant="filled"
                          multiline
                          required={!hasSelectedNfrSource}
                          error={touched && !!error}
                          helperText={touched && !!error ? error : undefined}
                        />
                      )}
                    </Field>
                    <Field name={`${baseFieldName}.${SpecificFundingFieldNames.Identifier}`}>
                      {({ field }: FieldProps<string>) => (
                        <TextField
                          {...field}
                          value={field.value ?? ''}
                          disabled={hasSelectedNfrSource}
                          label={t('common.id')}
                          fullWidth
                          variant="filled"
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
                          error={touched && !!error}
                          helperText={touched && !!error ? error : undefined}
                        />
                      )}
                    </Field>
                  </>
                )}
                <IconButton
                  sx={{ width: 'fit-content' }}
                  onClick={() => remove(index)}
                  title={t('registration.description.funding.remove_funding')}>
                  <CancelIcon color="primary" />
                </IconButton>
              </Box>
            );
          })}
        </>
      )}
    </FieldArray>
  );
};
