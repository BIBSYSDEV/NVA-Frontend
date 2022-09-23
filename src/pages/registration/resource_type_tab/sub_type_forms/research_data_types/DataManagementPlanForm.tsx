import { Autocomplete, Box, Button, Skeleton, TextField, Typography } from '@mui/material';
import { FieldArray, FieldArrayRenderProps, useFormikContext } from 'formik';
import { useState } from 'react';
import { SearchApiPath } from '../../../../../api/apiPaths';
import { EmphasizeSubstring } from '../../../../../components/EmphasizeSubstring';
import { SearchResponse } from '../../../../../types/common.types';
import { ResourceFieldNames } from '../../../../../types/publicationFieldNames';
import { ResearchDataRegistration } from '../../../../../types/publication_types/researchDataRegistration.types';
import { Registration } from '../../../../../types/registration.types';
import { useDebounce } from '../../../../../utils/hooks/useDebounce';
import { useFetch } from '../../../../../utils/hooks/useFetch';
import { getTitleString } from '../../../../../utils/registration-helpers';
import { PublisherField } from '../../components/PublisherField';
import { YearAndContributorsText } from '../../components/SearchContainerField';

export const DataManagementPlanForm = () => {
  const { values } = useFormikContext<ResearchDataRegistration>();
  const relatedResourceIds = values.entityDescription?.reference?.publicationInstance.related ?? [];

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery);

  const [searchOptions, isLoadingSearchOptions] = useFetch<SearchResponse<Registration>>({
    url: debouncedSearchQuery ? `${SearchApiPath.Registrations}?query=${debouncedSearchQuery}` : '',
  });

  return (
    <>
      <PublisherField />

      <Typography variant="h2">Relaterte registreringer</Typography>
      <FieldArray name={ResourceFieldNames.PublicationInstanceRelated}>
        {({ push, remove }: FieldArrayRenderProps) => (
          <>
            <Autocomplete
              options={searchOptions?.hits ?? []}
              value={null}
              onChange={(_, value) => {
                if (value?.id) {
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
                  onChange={(event) => {
                    setSearchQuery(event.target.value);
                  }}
                  variant="filled"
                  label="Søk etter relaterte registreringer"
                />
              )}
            />
            {relatedResourceIds.map((id, index) => (
              <SelectedRegistrationRow key={id} id={id} removeLinkedRegistration={() => remove(index)} />
            ))}
          </>
        )}
      </FieldArray>
    </>
  );
};

interface SelectedRegistrationRowProps {
  id: string;
  removeLinkedRegistration: () => void;
}

const SelectedRegistrationRow = ({ id, removeLinkedRegistration }: SelectedRegistrationRowProps) => {
  const [registration, isLoadingRegistration] = useFetch<Registration>({ url: id });

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {isLoadingRegistration ? (
        <Skeleton width={'30%'} />
      ) : (
        <Typography>{getTitleString(registration?.entityDescription?.mainTitle)}</Typography>
      )}
      <Button variant="outlined" sx={{ ml: '1rem' }} color="error" onClick={() => removeLinkedRegistration()}>
        Fjern
      </Button>
    </Box>
  );
};
