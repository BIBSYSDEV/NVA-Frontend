import { Autocomplete, Box, List, TextField, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Field, FieldArray, FieldArrayRenderProps, FieldProps, useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FetchResultsParams, fetchResults } from '../../../../../api/searchApi';
import { EmphasizeSubstring } from '../../../../../components/EmphasizeSubstring';
import { ResearchDataType, ResourceFieldNames } from '../../../../../types/publicationFieldNames';
import {
  ConfirmedDocument,
  ResearchDataRegistration,
} from '../../../../../types/publication_types/researchDataRegistration.types';
import { dataTestId } from '../../../../../utils/dataTestIds';
import { useDebounce } from '../../../../../utils/hooks/useDebounce';
import { findRelatedDocumentIndex, getTitleString } from '../../../../../utils/registration-helpers';
import { filterConfirmedDocuments } from '../../../../public_registration/PublicRegistrationContent';
import { YearAndContributorsText } from '../../components/SearchContainerField';
import { ExternalLinkField } from './ExternalLinkField';
import { RelatedResourceRow } from './RelatedResourceRow';

export const DatasetForm = () => {
  const { t } = useTranslation();
  const { values } = useFormikContext<ResearchDataRegistration>();
  const { related, compliesWith, referencedBy } = values.entityDescription.reference.publicationInstance;

  const relatedResources = related ?? [];
  const confirmedRelatedResources = filterConfirmedDocuments(relatedResources);

  const [relatedRegistrationsQuery, setRelatedRegistrationsQuery] = useState('');
  const debouncedRelatedRegistrationsQuery = useDebounce(relatedRegistrationsQuery);

  const relatedRegistrationsOptionsQueryConfig: FetchResultsParams = {
    query: debouncedRelatedRegistrationsQuery,
    categoryNot: ResearchDataType.DataManagementPlan,
    idNot: values.identifier,
    results: 20,
  };
  const relatedRegistrationsOptionsQuery = useQuery({
    queryKey: ['registrations', relatedRegistrationsOptionsQueryConfig],
    queryFn: ({ signal }) => fetchResults(relatedRegistrationsOptionsQueryConfig, signal),
    meta: { errorMessage: t('feedback.error.search') },
  });

  const [relatedDmpQuery, setRelatedDmpQuery] = useState('');
  const debouncedRelatedDmpQuery = useDebounce(relatedDmpQuery);

  const relatedDmpOptionsQueryConfig: FetchResultsParams = {
    title: debouncedRelatedDmpQuery,
    category: ResearchDataType.DataManagementPlan,
    results: 20,
  };
  const relatedDmpOptionsQuery = useQuery({
    queryKey: ['registrations', relatedDmpOptionsQueryConfig],
    queryFn: ({ signal }) => fetchResults(relatedDmpOptionsQueryConfig, signal),
    meta: { errorMessage: t('feedback.error.search') },
  });

  return (
    <>
      <Field name={ResourceFieldNames.PublicationInstanceGeographicDescription}>
        {({ field }: FieldProps<string>) => (
          <TextField
            {...field}
            data-testid={dataTestId.registrationWizard.resourceType.geographicDescriptionField}
            variant="filled"
            label={t('registration.resource_type.research_data.geographic_description')}
          />
        )}
      </Field>

      <Typography variant="h2">{t('registration.resource_type.research_data.related_links')}</Typography>
      <FieldArray name={ResourceFieldNames.PublicationInstanceReferencedBy}>
        {({ push, remove }: FieldArrayRenderProps) => (
          <>
            <Autocomplete
              options={relatedRegistrationsOptionsQuery.data?.hits ?? []}
              value={null}
              onChange={(_, value) => {
                if (value?.id && !referencedBy?.includes(value.id)) {
                  push(value.id);
                }
                setRelatedRegistrationsQuery('');
              }}
              blurOnSelect
              loading={relatedRegistrationsOptionsQuery.isLoading}
              filterOptions={(options) => options}
              getOptionLabel={(option) => getTitleString(option.entityDescription?.mainTitle)}
              renderOption={(props, option, state) => (
                <li {...props} key={option.identifier}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="subtitle1">
                      <EmphasizeSubstring
                        text={getTitleString(option.entityDescription?.mainTitle)}
                        emphasized={state.inputValue}
                      />
                    </Typography>
                    <YearAndContributorsText
                      date={option.entityDescription?.publicationDate}
                      contributors={option.entityDescription?.contributors ?? []}
                    />
                  </Box>
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  data-testid={dataTestId.registrationWizard.resourceType.relatedRegistrationField}
                  sx={{ maxWidth: '40rem' }}
                  onChange={(event) => {
                    setRelatedRegistrationsQuery(event.target.value);
                  }}
                  variant="filled"
                  label={t('registration.resource_type.research_data.search_for_related_registrations')}
                />
              )}
            />

            {referencedBy && referencedBy.length > 0 && (
              <List>
                {referencedBy.map((uri) => (
                  <RelatedResourceRow
                    key={uri}
                    uri={uri}
                    removeRelatedResource={() => remove(referencedBy.indexOf(uri))}
                  />
                ))}
              </List>
            )}
          </>
        )}
      </FieldArray>

      <FieldArray name={ResourceFieldNames.PublicationInstanceCompliesWith}>
        {({ push, remove }: FieldArrayRenderProps) => (
          <>
            <Autocomplete
              options={relatedDmpOptionsQuery.data?.hits ?? []}
              value={null}
              onChange={(_, value) => {
                if (value?.id && !compliesWith?.includes(value.id)) {
                  push(value.id);
                }
                setRelatedDmpQuery('');
              }}
              blurOnSelect
              loading={relatedDmpOptionsQuery.isLoading}
              filterOptions={(options) => options}
              getOptionLabel={(option) => getTitleString(option.entityDescription?.mainTitle)}
              renderOption={(props, option, state) => (
                <li {...props} key={option.identifier}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="subtitle1">
                      <EmphasizeSubstring
                        text={getTitleString(option.entityDescription?.mainTitle)}
                        emphasized={state.inputValue}
                      />
                    </Typography>
                    <YearAndContributorsText
                      date={option.entityDescription?.publicationDate}
                      contributors={option.entityDescription?.contributors ?? []}
                    />
                  </Box>
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  data-testid={dataTestId.registrationWizard.resourceType.compliesWithField}
                  sx={{ maxWidth: '40rem' }}
                  onChange={(event) => setRelatedDmpQuery(event.target.value)}
                  variant="filled"
                  label={t('registration.resource_type.research_data.search_for_related_dmps')}
                />
              )}
            />

            {compliesWith && compliesWith.length > 0 && (
              <List>
                {compliesWith.map((uri) => (
                  <RelatedResourceRow
                    key={uri}
                    uri={uri}
                    removeRelatedResource={() => remove(compliesWith.indexOf(uri))}
                  />
                ))}
              </List>
            )}
          </>
        )}
      </FieldArray>

      <FieldArray name={ResourceFieldNames.PublicationInstanceRelated}>
        {({ push, remove }: FieldArrayRenderProps) => (
          <>
            <ExternalLinkField
              onAddClick={(url) => {
                if (url && !confirmedRelatedResources.includes(url)) {
                  const confirmedDocument: ConfirmedDocument = {
                    type: 'ConfirmedDocument',
                    identifier: url,
                  };
                  push(confirmedDocument);
                }
              }}
            />

            {confirmedRelatedResources.length > 0 && (
              <List>
                {confirmedRelatedResources.map((uri) => (
                  <RelatedResourceRow
                    key={uri}
                    uri={uri}
                    removeRelatedResource={() => remove(findRelatedDocumentIndex(relatedResources, uri))}
                  />
                ))}
              </List>
            )}
          </>
        )}
      </FieldArray>
    </>
  );
};
