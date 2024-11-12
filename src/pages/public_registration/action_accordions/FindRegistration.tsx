import SearchIcon from '@mui/icons-material/Search';
import { Autocomplete, Box, TextField, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FetchResultsParams, fetchResults } from '../../../api/searchApi';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { RegistrationListItemContent } from '../../../components/RegistrationList';
import { SearchListItem } from '../../../components/styled/Wrappers';
import { Registration } from '../../../types/registration.types';
import { useDebounce } from '../../../utils/hooks/useDebounce';

function isDoi(query: string) {
  return query.includes('https://doi.org/');
}

interface FindRegistrationProps {
  setSelectedRegistration: (registration: Registration | null) => void;
  selectedRegistration: Registration | null;
  filteredRegistrationIdentifier: string;
}
export const FindRegistration = ({
  setSelectedRegistration,
  selectedRegistration,
  filteredRegistrationIdentifier,
}: FindRegistrationProps) => {
  const { t } = useTranslation();
  const [searchBeforeDebounce, setSearchBeforeDebounce] = useState('');
  const debouncedSearch = useDebounce(searchBeforeDebounce);

  const fetchQuery: FetchResultsParams = {
    doi: isDoi(debouncedSearch) ? debouncedSearch : null,
    query: !isDoi(debouncedSearch) ? debouncedSearch : null,
  };

  const duplicateRegistrationSearch = useQuery({
    enabled: debouncedSearch.length > 0,
    queryKey: ['duplicateRegistration', fetchQuery],
    queryFn: () => fetchResults(fetchQuery),
    meta: { errorMessage: t('feedback.error.get_registrations') },
  });

  const searchResults = duplicateRegistrationSearch.data?.hits ?? [];

  const searchResultNotContainingToBeDeleted = searchResults.filter(
    (possibleDuplicate) => possibleDuplicate.identifier !== filteredRegistrationIdentifier
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Typography variant="h3">{t('unpublish_actions.search_for_duplicate')}</Typography>
      <Autocomplete
        options={searchResultNotContainingToBeDeleted}
        getOptionLabel={(option: Registration | string) => {
          if (typeof option === 'string') {
            return option;
          }
          return option.entityDescription?.mainTitle ?? '';
        }}
        freeSolo
        loading={duplicateRegistrationSearch.isPending && debouncedSearch.length > 0}
        value={selectedRegistration}
        onChange={(_, newValue) => {
          if (typeof newValue === 'string') {
            setSelectedRegistration(null);
          } else {
            setSelectedRegistration(newValue);
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={t('unpublish_actions.search_duplicate_facets')}
            variant="filled"
            label={t('unpublish_actions.duplicate')}
            onChange={(event) => setSearchBeforeDebounce(event.target.value)}
            InputProps={{
              ...params.InputProps,
              type: 'search',
              startAdornment: <SearchIcon />,
            }}
          />
        )}
      />
      {!!selectedRegistration && (
        <>
          <Typography>{t('common.result')}</Typography>
          <ErrorBoundary>
            <SearchListItem sx={{ borderLeftColor: 'registration.main' }}>
              <RegistrationListItemContent target="_blank" registration={selectedRegistration} />
            </SearchListItem>
          </ErrorBoundary>
        </>
      )}
    </Box>
  );
};
