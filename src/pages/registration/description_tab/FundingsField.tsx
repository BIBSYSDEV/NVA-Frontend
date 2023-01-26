import { Autocomplete, Box, Button, Divider, TextField, Typography } from '@mui/material';
import { Field, FieldArray, FieldArrayRenderProps, FieldProps, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { CristinApiPath } from '../../../api/apiPaths';
import { AutocompleteTextField } from '../../../components/AutocompleteTextField';
import { FundingSources } from '../../../types/project.types';
import { emptyFunding, Registration } from '../../../types/registration.types';
import { useFetchResource } from '../../../utils/hooks/useFetchResource';
import { getLanguageString } from '../../../utils/translation-helpers';

export const FundingsField = () => {
  const { t } = useTranslation();
  const { values, setFieldValue } = useFormikContext<Registration>();
  const [fundingSources, isLoadingFundingSources] = useFetchResource<FundingSources>(CristinApiPath.FundingSources);
  const fundingSourcesList = fundingSources?.sources ?? [];

  return (
    <FieldArray name="fundings">
      {({ name, remove, push }: FieldArrayRenderProps) => (
        <>
          <Divider />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography>Finansiering</Typography>

            <Button onClick={() => push(emptyFunding)}>Legg til finansiering</Button>
          </Box>

          {values.fundings.map((funding, index) => (
            <Box
              key={index}
              sx={{
                display: 'grid',
                // gridTemplateAreas: '"source name id amount remove"',
                gridTemplateColumns: '3fr 4fr 1fr 1fr 1fr',
                gap: '1rem',
                alignItems: 'center',
              }}>
              <Field name={`fundings[${index}].source`}>
                {({ field, meta: { touched, error } }: FieldProps<string>) => (
                  <>
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
                      disabled={!fundingSources || !!field.value}
                      getOptionLabel={(option) => getLanguageString(option.name)}
                      onChange={(event, value) => {
                        // console.log('value', value);
                        setFieldValue(field.name, value?.id);
                      }}
                      renderInput={(params) => (
                        <AutocompleteTextField
                          {...params}
                          label={t('registration.description.funding.funder')}
                          isLoading={isLoadingFundingSources}
                          placeholder={t('registration.description.funding.funder_filter')}
                          showSearchIcon={!field.value}
                        />
                      )}
                    />
                  </>
                )}
              </Field>
              {values.fundings[index].source && (
                <>
                  <Field name={`fundings[${index}].name`}>
                    {({ field }: FieldProps<string>) => (
                      <TextField {...field} value={field.value ?? ''} label={'name'} fullWidth variant="filled" />
                    )}
                  </Field>
                  <Field name={`fundings[${index}].identifier`}>
                    {({ field }: FieldProps<string>) => (
                      <TextField {...field} value={field.value ?? ''} label={'ID'} fullWidth variant="filled" />
                    )}
                  </Field>
                  <Field name={`fundings[${index}].fundingAmount.amount`}>
                    {({ field }: FieldProps<string>) => (
                      <TextField {...field} value={field.value ?? ''} label={'amount'} fullWidth variant="filled" />
                    )}
                  </Field>
                </>
              )}
              <Button
                variant="outlined"
                sx={{ width: 'fit-content', height: 'fit-content' }}
                onClick={() => remove(index)}>
                Fjern
              </Button>
            </Box>
          ))}
        </>
      )}
    </FieldArray>
  );
};
