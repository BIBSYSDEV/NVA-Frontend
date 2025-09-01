import SearchIcon from '@mui/icons-material/Search';
import { Box, InputAdornment, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchResults, FetchResultsParams } from '../../../api/searchApi';
import { ListPagination } from '../../../components/ListPagination';
import { ListSkeleton } from '../../../components/ListSkeleton';
import { RegistrationListItemContent } from '../../../components/RegistrationList';
import { SearchListItem } from '../../../components/styled/Wrappers';
import { RegistrationSearchItem } from '../../../types/registration.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { useDebounce } from '../../../utils/hooks/useDebounce';
import { RegistrationSortSelector } from '../../search/registration_search/RegistrationSortSelector';

function isDoi(query: string) {
  return query.includes('https://doi.org/');
}

const defaultRowsPerPage = 5;
const rowsPerPageOptions = [defaultRowsPerPage, 10, 20];

interface FindRegistrationProps {
  setSelectedRegistration: (registration?: RegistrationSearchItem) => void;
  selectedRegistration?: RegistrationSearchItem;
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

  const [page, setPage] = useState(defaultRowsPerPage);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);

  const fetchQuery: FetchResultsParams = {
    doi: isDoi(debouncedSearch) ? debouncedSearch : null,
    query: !isDoi(debouncedSearch) ? debouncedSearch : null,
    idNot: filteredRegistrationIdentifier,
    results: rowsPerPage,
    from: page * rowsPerPage,
  };

  const searchQuery = useQuery({
    enabled: debouncedSearch.length > 0,
    queryKey: ['registrations', fetchQuery],
    queryFn: () => fetchResults(fetchQuery),
    meta: { errorMessage: t('feedback.error.get_registrations') },
  });

  const searchResults = searchQuery.data?.hits ?? [];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <TextField
        data-testid={dataTestId.registrationLandingPage.tasksPanel.mergeRegistrationSearchField}
        placeholder={t('unpublish_actions.search_duplicate_facets')}
        variant="filled"
        label={t('unpublish_actions.duplicate')}
        onChange={(event) => setSearchBeforeDebounce(event.target.value)}
        slotProps={{
          input: {
            type: 'search',
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          },
        }}
      />

      <section>
        <ListPagination
          paginationAriaLabel={t('common.pagination_project_search')}
          count={searchQuery.data?.totalHits ?? 0}
          page={page + 1}
          onPageChange={(newPage) => setPage(newPage - 1)}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={rowsPerPageOptions}
          onRowsPerPageChange={(newRowsPerPage) => {
            setRowsPerPage(newRowsPerPage);
            setPage(0);
          }}
          maxHits={10_000}
          showPaginationTop
          sortingComponent={<RegistrationSortSelector />}>
          {searchQuery.isFetching ? (
            <ListSkeleton arrayLength={3} minWidth={40} height={100} />
          ) : searchResults.length > 0 ? (
            <RadioGroup sx={{ my: '0.5rem' }}>
              {searchResults.map((registration) => {
                const listItemId = `list-item-${registration.identifier}`;
                return (
                  <Box key={registration.identifier} sx={{ display: 'flex', gap: '0.1rem' }}>
                    <Radio
                      data-testid={dataTestId.registrationLandingPage.tasksPanel.mergeRegistrationRadio(
                        registration.identifier
                      )}
                      value={registration.id}
                      slotProps={{ input: { 'aria-labelledby': listItemId } }}
                    />
                    <SearchListItem id={listItemId} component="div" sx={{ borderLeftColor: 'registration.main' }}>
                      <RegistrationListItemContent registration={registration} />
                    </SearchListItem>
                  </Box>
                );
              })}
            </RadioGroup>
          ) : (
            <Typography>{t('common.no_hits')}</Typography>
          )}
        </ListPagination>
      </section>
    </Box>
  );
};
