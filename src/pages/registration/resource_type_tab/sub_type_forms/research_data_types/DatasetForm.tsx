import { Autocomplete, Box, TextField, Typography } from '@mui/material';
import { Field, FieldArray, FieldArrayRenderProps, FieldProps, useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SearchApiPath } from '../../../../../api/apiPaths';
import { EmphasizeSubstring } from '../../../../../components/EmphasizeSubstring';
import { SearchResponse } from '../../../../../types/common.types';
import {
  RegistrationFieldName,
  ResearchDataType,
  ResourceFieldNames,
} from '../../../../../types/publicationFieldNames';
import { ResearchDataRegistration } from '../../../../../types/publication_types/researchDataRegistration.types';
import { Registration } from '../../../../../types/registration.types';
import { useDebounce } from '../../../../../utils/hooks/useDebounce';
import { useFetch } from '../../../../../utils/hooks/useFetch';
import { getTitleString } from '../../../../../utils/registration-helpers';
import { YearAndContributorsText } from '../../components/SearchContainerField';
import { ExternalLinkField } from './ExternalLinkField';

export const DatasetForm = () => {
  const { t } = useTranslation();
  const { values } = useFormikContext<ResearchDataRegistration>();

  const [relatedRegistrationsQuery, setRelatedRegistrationsQuery] = useState('');
  const debouncedRelatedRegistrationsQuery = useDebounce(relatedRegistrationsQuery);
  const [relatedRegistrationsOptions, isLoadingRelatedRegistrationsOptions] = useFetch<SearchResponse<Registration>>({
    url: debouncedRelatedRegistrationsQuery
      ? `${SearchApiPath.Registrations}?query=${debouncedRelatedRegistrationsQuery} AND NOT (${ResourceFieldNames.SubType}:"${ResearchDataType.DataManagementPlan}") AND NOT (${RegistrationFieldName.Identifier}:"${values.id}")`
      : '',
  });

  const [relatedDmpQuery, setRelatedDmpQuery] = useState('');
  const debouncedRelatedDmpQuery = useDebounce(relatedDmpQuery);
  const [relatedDmpOptions, isLoadingRelatedDmpOptions] = useFetch<SearchResponse<Registration>>({
    url: debouncedRelatedDmpQuery
      ? `${SearchApiPath.Registrations}?query=${debouncedRelatedDmpQuery} AND (${ResourceFieldNames.SubType}:"${ResearchDataType.DataManagementPlan}")`
      : `${SearchApiPath.Registrations}?query=${ResourceFieldNames.SubType}:"${ResearchDataType.DataManagementPlan}"`,
  });

  return (
    <>
      {/* TODO: Field names to enum */}
      <Field name="geographicalCoverage">
        {({ field }: FieldProps<string>) => <TextField {...field} variant="filled" label={'Geografisk område'} />}
      </Field>

      <Typography variant="h2">{t('registration.resource_type.research_data.related_links')}</Typography>
      <FieldArray name={''}>
        {({ push, remove }: FieldArrayRenderProps) => (
          <>
            <Autocomplete
              options={relatedRegistrationsOptions?.hits ?? []}
              value={null}
              // onChange={(_, value) => {
              //   if (value?.id && !relatedResources.includes(value.id)) {
              //     push(value.id);
              //   }
              //   setSearchQuery('');
              // }}
              blurOnSelect
              loading={isLoadingRelatedRegistrationsOptions}
              filterOptions={(options) => options}
              getOptionLabel={(option) => getTitleString(option.entityDescription?.mainTitle)}
              renderOption={(props, option, state) => (
                <li {...props}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="subtitle1">
                      <EmphasizeSubstring
                        text={getTitleString(option.entityDescription?.mainTitle)}
                        emphasized={state.inputValue}
                      />
                    </Typography>
                    <YearAndContributorsText
                      date={option.entityDescription?.date}
                      contributors={option.entityDescription?.contributors ?? []}
                    />
                  </Box>
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  sx={{ maxWidth: '40rem' }}
                  onChange={(event) => {
                    setRelatedRegistrationsQuery(event.target.value);
                  }}
                  variant="filled"
                  label={t('registration.resource_type.research_data.search_for_related_registrations')}
                />
              )}
            />

            {/* <Box component="ul" sx={{ m: 0, p: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {internalResources.map((uri) => (
                <RelatedResourceRow
                  key={uri}
                  uri={uri}
                  removeRelatedResource={() => remove(relatedResources.indexOf(uri))}
                />
              ))}
            </Box> */}
          </>
        )}
      </FieldArray>

      <Autocomplete
        options={relatedDmpOptions?.hits ?? []}
        value={null}
        // onChange={(_, value) => {
        //   if (value?.id && !relatedResources.includes(value.id)) {
        //     push(value.id);
        //   }
        //   setSearchQuery('');
        // }}
        blurOnSelect
        loading={isLoadingRelatedDmpOptions}
        filterOptions={(options) => options}
        getOptionLabel={(option) => getTitleString(option.entityDescription?.mainTitle)}
        renderOption={(props, option, state) => (
          <li {...props}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant="subtitle1">
                <EmphasizeSubstring
                  text={getTitleString(option.entityDescription?.mainTitle)}
                  emphasized={state.inputValue}
                />
              </Typography>
              <YearAndContributorsText
                date={option.entityDescription?.date}
                contributors={option.entityDescription?.contributors ?? []}
              />
            </Box>
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            sx={{ maxWidth: '40rem' }}
            onChange={(event) => {
              setRelatedDmpQuery(event.target.value);
            }}
            variant="filled"
            label={t('registration.resource_type.research_data.search_for_related_dmps')}
          />
        )}
      />

      <ExternalLinkField
        onAddClick={(url) => {
          // if (!relatedResources.includes(url)) {
          //   push(url);
          // }
        }}
      />
    </>
  );
};

export const AcceptDatasetTermsDialog = () => {
  const { t } = useTranslation();

  return (
    <>
      <Typography fontWeight={500}>
        {t('registration.resource_type.research_data.accept_dataset_terms.contains_personal_data')}
      </Typography>
      <Typography paragraph>
        {t('registration.resource_type.research_data.accept_dataset_terms.contains_personal_data_description')}
      </Typography>

      <Typography fontWeight={500}>
        {t('registration.resource_type.research_data.accept_dataset_terms.contains_sensitive_data')}
      </Typography>
      <Typography paragraph>
        {t('registration.resource_type.research_data.accept_dataset_terms.contains_sensitive_data_description')}
      </Typography>

      <Typography>{t('registration.resource_type.research_data.accept_dataset_terms.further_info')}</Typography>
    </>
  );
};
