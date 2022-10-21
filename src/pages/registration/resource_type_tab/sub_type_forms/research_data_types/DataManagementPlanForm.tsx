import { Autocomplete, Box, List, TextField, Typography } from '@mui/material';
import { FieldArray, FieldArrayRenderProps, useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { SearchApiPath } from '../../../../../api/apiPaths';
import { EmphasizeSubstring } from '../../../../../components/EmphasizeSubstring';
import { SearchResponse } from '../../../../../types/common.types';
import { RegistrationFieldName, ResourceFieldNames } from '../../../../../types/publicationFieldNames';
import { ResearchDataRegistration } from '../../../../../types/publication_types/researchDataRegistration.types';
import { Registration } from '../../../../../types/registration.types';
import { API_URL } from '../../../../../utils/constants';
import { dataTestId } from '../../../../../utils/dataTestIds';
import { useDebounce } from '../../../../../utils/hooks/useDebounce';
import { useFetch } from '../../../../../utils/hooks/useFetch';
import { getTitleString } from '../../../../../utils/registration-helpers';
import { RegistrationParams } from '../../../../../utils/urlPaths';
import { PublisherField } from '../../components/PublisherField';
import { YearAndContributorsText } from '../../components/SearchContainerField';
import { ExternalLinkField } from './ExternalLinkField';
import { RelatedResourceRow } from './RelatedResourceRow';

export const DataManagementPlanForm = () => {
  const { t } = useTranslation();
  const params = useParams<RegistrationParams>();
  const { values } = useFormikContext<ResearchDataRegistration>();

  const relatedResources = values.entityDescription?.reference?.publicationInstance.related ?? [];
  const internalResources = relatedResources.filter((uri) => uri.includes(API_URL));
  const externalResources = relatedResources.filter((uri) => !uri.includes(API_URL));

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery);

  const [searchOptions, isLoadingSearchOptions] = useFetch<SearchResponse<Registration>>({
    url: debouncedSearchQuery
      ? `${SearchApiPath.Registrations}?query=${debouncedSearchQuery} AND NOT (${RegistrationFieldName.Identifier}:"${params.identifier}")`
      : '',
  });

  return (
    <>
      <PublisherField />

      <Typography variant="h2">{t('registration.resource_type.research_data.related_links')}</Typography>
      <FieldArray name={ResourceFieldNames.PublicationInstanceRelated}>
        {({ push, remove }: FieldArrayRenderProps) => (
          <>
            <Autocomplete
              options={searchOptions?.hits ?? []}
              value={null}
              onChange={(_, value) => {
                if (value?.id && !relatedResources.includes(value.id)) {
                  push(value.id);
                }
                setSearchQuery('');
              }}
              blurOnSelect
              loading={isLoadingSearchOptions}
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
                    setSearchQuery(event.target.value);
                  }}
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
                  removeRelatedResource={() => remove(relatedResources.indexOf(uri))}
                />
              ))}
            </List>

            <ExternalLinkField
              onAddClick={(url) => {
                if (!relatedResources.includes(url)) {
                  push(url);
                }
              }}
            />

            <List>
              {externalResources.map((uri) => (
                <RelatedResourceRow
                  key={uri}
                  uri={uri}
                  removeRelatedResource={() => remove(relatedResources.indexOf(uri))}
                />
              ))}
            </List>
          </>
        )}
      </FieldArray>
    </>
  );
};
