import { Autocomplete, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useQuery } from '@tanstack/react-query';
import { FieldArray, FieldArrayRenderProps, useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchResults, FetchResultsParams } from '../../../../api/searchApi';
import { EmphasizeSubstring } from '../../../../components/EmphasizeSubstring';
import { DegreeRegistration } from '../../../../types/publication_types/degreeRegistration.types';
import { ResourceFieldNames } from '../../../../types/publicationFieldNames';
import { ConfirmedDocument } from '../../../../types/registration.types';
import { dataTestId } from '../../../../utils/dataTestIds';
import { useDebounce } from '../../../../utils/hooks/useDebounce';
import { getTitleString } from '../../../../utils/registration-helpers';
import { YearAndContributorsText } from './SearchContainerField';

export const SearchRelatedResultField = () => {
  const { t } = useTranslation();
  const { values } = useFormikContext<DegreeRegistration>();
  const related = values.entityDescription.reference?.publicationInstance.related;
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
      {({ push }: FieldArrayRenderProps) => (
        <>
          <Autocomplete
            options={relatedRegistrationsOptionsQuery.data?.hits ?? []}
            value={null}
            onChange={(_, value) => {
              if (
                value?.id &&
                !related?.some((document) => document.type === 'ConfirmedDocument' && document.identifier === value.id)
              ) {
                const newRelation: ConfirmedDocument = {
                  type: 'ConfirmedDocument',
                  identifier: value.id,
                  sequence: related ? related.length + 1 : null,
                };
                push(newRelation);
              }
              setRelatedRegistrationsQuery('');
            }}
            blurOnSelect
            loading={relatedRegistrationsOptionsQuery.isPending}
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
        </>
      )}
    </FieldArray>
  );
};
