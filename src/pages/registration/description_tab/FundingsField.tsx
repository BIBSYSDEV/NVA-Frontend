import { Autocomplete, Box, Button, Divider, IconButton, TextField, Typography } from '@mui/material';
import { Field, FieldArray, FieldArrayRenderProps, FieldProps, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/AddCircleOutlineSharp';
import CancelIcon from '@mui/icons-material/Cancel';
import { CristinApiPath } from '../../../api/apiPaths';
import { AutocompleteTextField } from '../../../components/AutocompleteTextField';
import { FundingSources } from '../../../types/project.types';
import { emptyFunding, Registration } from '../../../types/registration.types';
import { useFetchResource } from '../../../utils/hooks/useFetchResource';
import { getLanguageString } from '../../../utils/translation-helpers';
import { NfrProjectSearch } from './NfrProjectSearch';

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

            <Button startIcon={<AddIcon />} onClick={() => push(emptyFunding)}>
              Legg til finansiering
            </Button>
          </Box>

          {values.fundings.map((funding, index) => {
            const baseFieldName = `fundings[${index}]`;
            const hasSelectedSource = !!values.fundings[index].source;
            const hasSelectedNfrSource = values.fundings[index].source.split('/').pop() === 'NFR';
            const hasSelectedNfrProject = hasSelectedNfrSource && values.fundings[index].id;
            return (
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
                            multiline
                          />
                        )}
                      />
                    </>
                  )}
                </Field>
                {hasSelectedNfrSource && !hasSelectedNfrProject && <NfrProjectSearch baseFieldName={baseFieldName} />}

                {hasSelectedSource && (!hasSelectedNfrSource || hasSelectedNfrProject) && (
                  <>
                    <Field name={`fundings[${index}].name`}>
                      {({ field }: FieldProps<string>) => (
                        <TextField
                          {...field}
                          value={field.value ?? ''}
                          disabled={hasSelectedNfrSource}
                          label={'Name'}
                          fullWidth
                          variant="filled"
                          multiline
                        />
                      )}
                    </Field>
                    <Field name={`fundings[${index}].identifier`}>
                      {({ field }: FieldProps<string>) => (
                        <TextField
                          {...field}
                          value={field.value ?? ''}
                          disabled={hasSelectedNfrSource}
                          label={'ID'}
                          fullWidth
                          variant="filled"
                        />
                      )}
                    </Field>
                    {!hasSelectedNfrSource && (
                      <Field name={`fundings[${index}].fundingAmount.amount`}>
                        {({ field }: FieldProps<string>) => (
                          <TextField
                            {...field}
                            value={field.value ?? ''}
                            disabled={hasSelectedNfrSource}
                            label={'Sum'}
                            fullWidth
                            variant="filled"
                          />
                        )}
                      </Field>
                    )}
                  </>
                )}
                <IconButton
                  sx={{ width: 'fit-content', height: 'fit-content' }}
                  onClick={() => remove(index)}
                  title="Fjern">
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
