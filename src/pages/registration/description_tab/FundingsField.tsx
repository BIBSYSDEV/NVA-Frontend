import { Autocomplete, Box, Button, Divider, IconButton, TextField, Typography } from '@mui/material';
import { Field, FieldArray, FieldArrayRenderProps, FieldProps, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/AddCircleOutlineSharp';
import CancelIcon from '@mui/icons-material/Cancel';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { CristinApiPath } from '../../../api/apiPaths';
import { AutocompleteTextField } from '../../../components/AutocompleteTextField';
import { FundingSources } from '../../../types/project.types';
import { emptyFunding, Registration } from '../../../types/registration.types';
import { useFetchResource } from '../../../utils/hooks/useFetchResource';
import { getLanguageString } from '../../../utils/translation-helpers';
import { NfrProjectSearch } from './NfrProjectSearch';
import { getNfrProjectUrl } from './projects_field/projectHelpers';
import { fundingSourceIsNfr } from '../../../utils/registration-helpers';

export const FundingsField = () => {
  const { t } = useTranslation();
  const { values, setFieldValue, setFieldTouched } = useFormikContext<Registration>();
  const [fundingSources, isLoadingFundingSources] = useFetchResource<FundingSources>(CristinApiPath.FundingSources);
  const fundingSourcesList = fundingSources?.sources ?? [];

  return (
    <FieldArray name="fundings">
      {({ name, remove, push }: FieldArrayRenderProps) => (
        <>
          <Divider />
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
                  gridTemplateColumns: { xs: '1fr', md: '5fr 6fr 2fr 2fr 1fr' },
                  gap: '1rem',
                  alignItems: 'start',
                }}>
                <Field name={`${baseFieldName}.source`}>
                  {({ field, meta: { touched, error } }: FieldProps<string>) => (
                    <Autocomplete
                      value={fundingSourcesList.find((source) => source.id === field.value) ?? null}
                      fullWidth
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
                        //  TODO: Check if identical names are expected. If not, remove renderOption?
                        <li {...props} key={option.identifier}>
                          {getLanguageString(option.name)}
                        </li>
                      )}
                      onBlur={() => setFieldTouched(field.name, true, false)}
                      disabled={!fundingSources || !!field.value}
                      getOptionLabel={(option) => getLanguageString(option.name)}
                      onChange={(_, value) => setFieldValue(field.name, value?.id)}
                      renderInput={(params) => (
                        <AutocompleteTextField
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
                    <NfrProjectSearch baseFieldName={baseFieldName} />
                  ))}

                {!hasSelectedNfrSource && hasSelectedSource && (
                  <>
                    <Field name={`${baseFieldName}.labels.nb`}>
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
                    <Field name={`${baseFieldName}.identifier`}>
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

                    <Field name={`${baseFieldName}.fundingAmount.amount`}>
                      {({ field }: FieldProps<number>) => (
                        <TextField
                          {...field}
                          type="number"
                          value={field.value > 0 ? field.value : ''}
                          disabled={hasSelectedNfrSource}
                          label={t('registration.description.funding.funding_sum')}
                          fullWidth
                          variant="filled"
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
