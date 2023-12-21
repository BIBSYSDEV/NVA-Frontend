import { Autocomplete, Box, List, TextField, Typography } from '@mui/material';
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
import {
  ConfirmedDocument,
  ResearchDataRegistration,
} from '../../../../../types/publication_types/researchDataRegistration.types';
import { Registration } from '../../../../../types/registration.types';
import { dataTestId } from '../../../../../utils/dataTestIds';
import { useDebounce } from '../../../../../utils/hooks/useDebounce';
import { useFetch } from '../../../../../utils/hooks/useFetch';
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
  const [relatedRegistrationsOptions, isLoadingRelatedRegistrationsOptions] = useFetch<SearchResponse<Registration>>({
    url: debouncedRelatedRegistrationsQuery
      ? `${SearchApiPath.Registrations}?query=${debouncedRelatedRegistrationsQuery} AND NOT (${ResourceFieldNames.RegistrationType}:"${ResearchDataType.DataManagementPlan}") AND NOT (${RegistrationFieldName.Identifier}:"${values.identifier}")`
      : '',
  });

  const [relatedDmpQuery, setRelatedDmpQuery] = useState('');
  const debouncedRelatedDmpQuery = useDebounce(relatedDmpQuery);
  const [relatedDmpOptions, isLoadingRelatedDmpOptions] = useFetch<SearchResponse<Registration>>({
    url: debouncedRelatedDmpQuery
      ? `${SearchApiPath.Registrations}?query=${debouncedRelatedDmpQuery} AND (${ResourceFieldNames.RegistrationType}:"${ResearchDataType.DataManagementPlan}")`
      : `${SearchApiPath.Registrations}?query=${ResourceFieldNames.RegistrationType}:"${ResearchDataType.DataManagementPlan}"`,
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
              options={relatedRegistrationsOptions?.hits ?? []}
              value={null}
              onChange={(_, value) => {
                if (value?.id && !referencedBy?.includes(value.id)) {
                  push(value.id);
                }
                setRelatedRegistrationsQuery('');
              }}
              blurOnSelect
              loading={isLoadingRelatedRegistrationsOptions}
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
              options={relatedDmpOptions?.hits ?? []}
              value={null}
              onChange={(_, value) => {
                if (value?.id && !compliesWith?.includes(value.id)) {
                  push(value.id);
                }
                setRelatedDmpQuery('');
              }}
              blurOnSelect
              loading={isLoadingRelatedDmpOptions}
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
