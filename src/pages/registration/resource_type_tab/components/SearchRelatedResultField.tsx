import { Autocomplete, List, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useQuery } from '@tanstack/react-query';
import { FieldArray, FieldArrayRenderProps, useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FetchResultsParams, fetchResults } from '../../../../api/searchApi';
import { EmphasizeSubstring } from '../../../../components/EmphasizeSubstring';
import { ResourceFieldNames } from '../../../../types/publicationFieldNames';
import { DegreeRegistration } from '../../../../types/publication_types/degreeRegistration.types';
import { ConfirmedDocument } from '../../../../types/publication_types/researchDataRegistration.types';
import { dataTestId } from '../../../../utils/dataTestIds';
import { useDebounce } from '../../../../utils/hooks/useDebounce';
import { getTitleString } from '../../../../utils/registration-helpers';
import { filterConfirmedDocuments } from '../../../public_registration/PublicRegistrationContent';
import { RelatedResourceRow } from '../sub_type_forms/research_data_types/RelatedResourceRow';
import { YearAndContributorsText } from './SearchContainerField';

export const SearchRelatedResultField = () => {
  const { t } = useTranslation();

  const { values } = useFormikContext<DegreeRegistration>();
  const related = values.entityDescription.reference?.publicationInstance.related;

  const confirmedRelatedResources = filterConfirmedDocuments(related);

  const [relatedRegistrationsQuery, setRelatedRegistrationsQuery] = useState('');
  const debouncedRelatedRegistrationsQuery = useDebounce(relatedRegistrationsQuery);

  const relatedRegistrationsOptionsQueryConfig: FetchResultsParams = {
    query: debouncedRelatedRegistrationsQuery,
    idNot: values.identifier,
    results: 20,
  };
  const relatedRegistrationsOptionsQuery = useQuery({
    queryKey: ['registrations', relatedRegistrationsOptionsQueryConfig],
    queryFn: ({ signal }) => fetchResults(relatedRegistrationsOptionsQueryConfig, signal),
    meta: { errorMessage: t('feedback.error.search') },
  });

  return (
    <FieldArray name={ResourceFieldNames.PublicationInstanceRelated}>
      {({ push, remove }: FieldArrayRenderProps) => (
        <>
          <Autocomplete
            options={relatedRegistrationsOptionsQuery.data?.hits ?? []}
            value={null}
            onChange={(_, value) => {
              if (value?.id && !related?.some((r) => r.type === 'ConfirmedDocument' && r.identifier === value.id)) {
                const newRelation: ConfirmedDocument = {
                  type: 'ConfirmedDocument',
                  identifier: value.id,
                };
                push(newRelation);
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
                onChange={(event) => setRelatedRegistrationsQuery(event.target.value)}
                variant="filled"
                label={t('registration.resource_type.research_data.search_for_related_registrations')}
              />
            )}
          />
          {confirmedRelatedResources.length > 0 && (
            <List>
              {confirmedRelatedResources.map((uri) => (
                <RelatedResourceRow
                  key={uri}
                  uri={uri}
                  removeRelatedResource={() => {
                    const indexToRemove =
                      (related as ConfirmedDocument[])?.findIndex((r) => r.identifier === uri) ?? -1;
                    if (indexToRemove > -1) {
                      remove(indexToRemove);
                    }
                  }}
                />
              ))}
            </List>
          )}
        </>
      )}
    </FieldArray>
  );
};
