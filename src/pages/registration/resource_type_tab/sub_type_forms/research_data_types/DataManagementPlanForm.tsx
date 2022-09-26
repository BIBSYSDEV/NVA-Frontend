import { Autocomplete, Box, Button, Link, Skeleton, TextField, Typography } from '@mui/material';
import { FieldArray, FieldArrayRenderProps, useFormikContext } from 'formik';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { SearchApiPath } from '../../../../../api/apiPaths';
import { EmphasizeSubstring } from '../../../../../components/EmphasizeSubstring';
import { SearchResponse } from '../../../../../types/common.types';
import { ResourceFieldNames } from '../../../../../types/publicationFieldNames';
import { ResearchDataRegistration } from '../../../../../types/publication_types/researchDataRegistration.types';
import { Registration } from '../../../../../types/registration.types';
import { API_URL } from '../../../../../utils/constants';
import { useDebounce } from '../../../../../utils/hooks/useDebounce';
import { useFetch } from '../../../../../utils/hooks/useFetch';
import { getTitleString } from '../../../../../utils/registration-helpers';
import { getRegistrationLandingPagePath } from '../../../../../utils/urlPaths';
import { PublisherField } from '../../components/PublisherField';
import { YearAndContributorsText } from '../../components/SearchContainerField';

export const DataManagementPlanForm = () => {
  const { values } = useFormikContext<ResearchDataRegistration>();
  const relatedResourceUris = values.entityDescription?.reference?.publicationInstance.related ?? [];

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
            <Box sx={{ display: 'flex', gap: '1rem' }}>
              <TextField
                variant="filled"
                fullWidth
                label="Eksterne lenker"
                onChange={(event) => push(event.target.value)}
              />
              <Button variant="outlined">Legg til lenke</Button>
            </Box>
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
            {relatedResourceUris.map((uri, index) => (
              <RelatedResourceRow key={uri} uri={uri} removeRelatedResource={() => remove(index)} />
            ))}
          </>
        )}
      </FieldArray>
    </>
  );
};

interface RelatedResourceRowRowProps {
  uri: string;
  removeRelatedResource: () => void;
}

const RelatedResourceRow = ({ uri, removeRelatedResource }: RelatedResourceRowRowProps) => {
  const isInternalRegistration = uri.includes(API_URL);
  const [registration, isLoadingRegistration] = useFetch<Registration>({ url: isInternalRegistration ? uri : '' });

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {isLoadingRegistration ? (
        <Skeleton width="30%" />
      ) : (
        <>
          {isInternalRegistration ? (
            <Link component={RouterLink} to={getRegistrationLandingPagePath(registration?.identifier ?? '')}>
              {getTitleString(registration?.entityDescription?.mainTitle)}
            </Link>
          ) : (
            <Link href={uri}>{uri}</Link>
          )}
          <Button variant="outlined" sx={{ ml: '1rem' }} color="error" onClick={() => removeRelatedResource()}>
            Fjern
          </Button>
        </>
      )}
    </Box>
  );
};
