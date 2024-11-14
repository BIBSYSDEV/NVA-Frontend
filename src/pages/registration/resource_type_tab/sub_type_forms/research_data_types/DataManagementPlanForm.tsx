import { Autocomplete, Box, List, TextField, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { FieldArray, FieldArrayRenderProps, useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { fetchResults, FetchResultsParams } from '../../../../../api/searchApi';
import { EmphasizeSubstring } from '../../../../../components/EmphasizeSubstring';
import { ResearchDataRegistration } from '../../../../../types/publication_types/researchDataRegistration.types';
import { ResourceFieldNames } from '../../../../../types/publicationFieldNames';
import { ConfirmedDocument } from '../../../../../types/registration.types';
import { API_URL } from '../../../../../utils/constants';
import { dataTestId } from '../../../../../utils/dataTestIds';
import { useDebounce } from '../../../../../utils/hooks/useDebounce';
import { findRelatedDocumentIndex, getTitleString } from '../../../../../utils/registration-helpers';
import { IdentifierParams } from '../../../../../utils/urlPaths';
import { filterConfirmedDocuments } from '../../../../public_registration/PublicRegistrationContent';
import { PublisherField } from '../../components/PublisherField';
import { YearAndContributorsText } from '../../components/SearchContainerField';
import { ExternalLinkField } from './ExternalLinkField';
import { RelatedResourceRow } from './RelatedResourceRow';

export const DataManagementPlanForm = () => {
  const { t } = useTranslation();
  const params = useParams<IdentifierParams>();
  const { values } = useFormikContext<ResearchDataRegistration>();

  const relatedResources = values.entityDescription?.reference?.publicationInstance.related ?? [];
  const confirmedRelatedResources = filterConfirmedDocuments(relatedResources);
  const internalResources = confirmedRelatedResources.filter((uri) => uri.includes(API_URL));
  const externalResources = confirmedRelatedResources.filter((uri) => !uri.includes(API_URL));

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery);

  const searchOptionsQueryConfig: FetchResultsParams = {
    title: debouncedSearchQuery,
    idNot: params.identifier,
    results: 20,
  };
  const searchOptionsQuery = useQuery({
    queryKey: ['registrations', searchOptionsQueryConfig],
    queryFn: ({ signal }) => fetchResults(searchOptionsQueryConfig, signal),
    meta: { errorMessage: t('feedback.error.search') },
  });

  return (
    <>
      <PublisherField />

      <Typography variant="h2">{t('registration.resource_type.research_data.related_links')}</Typography>
      <FieldArray name={ResourceFieldNames.PublicationInstanceRelated}>
        {({ push, remove }: FieldArrayRenderProps) => (
          <>
            <Autocomplete
              options={searchOptionsQuery.data?.hits ?? []}
              value={null}
              onChange={(_, value) => {
                if (value?.id && !confirmedRelatedResources.includes(value.id)) {
                  const confirmedDocument: ConfirmedDocument = {
                    type: 'ConfirmedDocument',
                    identifier: value.id,
                  };
                  push(confirmedDocument);
                }
                setSearchQuery('');
              }}
              blurOnSelect
              loading={searchOptionsQuery.isPending}
              filterOptions={(options) => options}
              getOptionLabel={(option) => getTitleString(option.entityDescription?.mainTitle)}
              renderOption={({ key, ...props }, option, state) => (
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
                      contributors={option.entityDescription?.contributorsPreview ?? []}
                    />
                  </Box>
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  sx={{ maxWidth: '40rem' }}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  variant="filled"
                  label={t('registration.resource_type.research_data.search_for_related_registrations')}
                  helperText={t('registration.resource_type.research_data.search_for_related_registrations_helper')}
                  data-testid={dataTestId.registrationWizard.resourceType.relatedRegistrationField}
                />
              )}
            />

            <List>
              {internalResources.map((uri) => (
                <RelatedResourceRow
                  key={uri}
                  uri={uri}
                  removeRelatedResource={() => remove(findRelatedDocumentIndex(relatedResources, uri))}
                />
              ))}
            </List>

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

            <List>
              {externalResources.map((uri) => (
                <RelatedResourceRow
                  key={uri}
                  uri={uri}
                  removeRelatedResource={() => remove(findRelatedDocumentIndex(relatedResources, uri))}
                />
              ))}
            </List>
          </>
        )}
      </FieldArray>
    </>
  );
};
