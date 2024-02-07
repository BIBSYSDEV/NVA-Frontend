import { Registration } from '../../../types/registration.types';
import { Autocomplete, Box, IconButton, TextField, Typography } from '@mui/material';
import { dataTestId } from '../../../utils/dataTestIds';
import SearchIcon from '@mui/icons-material/Search';
import { useQuery } from '@tanstack/react-query';
import { fetchResults } from '../../../api/searchApi';
import { useState } from 'react';
import { useDebounce } from '../../../utils/hooks/useDebounce';
import { useTranslation } from 'react-i18next';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { SearchListItem } from '../../../components/styled/Wrappers';
import { RegistrationListItemContent } from '../../../components/RegistrationList';

function isTitle(query: string) {
  return !isDoi(query) && !isHandle(query);
}

function isDoi(query: string) {
  return query.includes('https://doi.org/');
}

function isHandle(query: string) {
  return query.includes('https://hdl.handle.net/');
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

  const fetchQuery = {
    title: isTitle(debouncedSearch) ? debouncedSearch : null,
    doi: isDoi(debouncedSearch) ? debouncedSearch : null,
    query: isHandle(debouncedSearch) ? debouncedSearch : null,
  };

  const duplicateRegistrationSearch = useQuery({
    enabled: debouncedSearch.length > 0,
    queryKey: ['duplicateRegistration', fetchQuery],
    queryFn: () => fetchResults(fetchQuery),
    meta: { errorMessage: t('feedback.error.get_import_candidates') },
  });

  const handleSearchAutoCompleteChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setSearchBeforeDebounce(event.target.value);
  };

  const searchResults = duplicateRegistrationSearch.data?.hits ?? [];

  const searchResultNotContainingToBeDeleted = searchResults.filter(
    (possibleDuplicate) => possibleDuplicate.identifier !== filteredRegistrationIdentifier
  );

  const defaultProps = {
    options: searchResultNotContainingToBeDeleted,
    getOptionLabel: (option: Registration | string) => {
      if (typeof option === 'string') {
        return option;
      }
      return option.entityDescription?.mainTitle ?? '';
    },
  };
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Typography variant="h3">Søk etter registrert resultat</Typography>
      <Autocomplete
        {...defaultProps}
        freeSolo
        id="gurba gusdfasd"
        loading={duplicateRegistrationSearch.isLoading && debouncedSearch.length > 0}
        value={selectedRegistration}
        onChange={(_event, newValue, _reason) => {
          if (typeof newValue === 'string') {
            setSelectedRegistration(null);
          } else {
            setSelectedRegistration(newValue);
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={'Søk med DOI, handle eller tittel'}
            variant="filled"
            onChange={(event) => handleSearchAutoCompleteChange(event)}
            InputProps={{
              ...params.InputProps,
              type: 'search',
              startAdornment: (
                <IconButton
                  type="button"
                  data-testid={dataTestId.startPage.searchButton}
                  title={t('common.search')}
                  size="large">
                  <SearchIcon />
                </IconButton>
              ),
            }}
          />
        )}
      />
      {!!selectedRegistration && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', mt: '1rem' }}>
          <Typography>Resultat</Typography>
          <ErrorBoundary>
            <SearchListItem sx={{ borderLeftColor: 'registration.main' }}>
              <RegistrationListItemContent target="_blank" registration={selectedRegistration} />
            </SearchListItem>
          </ErrorBoundary>
        </Box>
      )}
    </Box>
  );
};
