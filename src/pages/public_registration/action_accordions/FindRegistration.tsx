import SearchIcon from '@mui/icons-material/Search';
import { Box, InputAdornment, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { fetchResults, FetchResultsParams } from '../../../api/searchApi';
import { ListPagination } from '../../../components/ListPagination';
import { ListSkeleton } from '../../../components/ListSkeleton';
import { RegistrationListItemContent } from '../../../components/RegistrationList';
import { SearchListItem } from '../../../components/styled/Wrappers';
import { RootState } from '../../../redux/store';
import { RegistrationSearchItem } from '../../../types/registration.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { getIdentifierFromId } from '../../../utils/general-helpers';
import { useDebounce } from '../../../utils/hooks/useDebounce';
import { RegistrationSortSelector } from '../../search/registration_search/RegistrationSortSelector';

function isDoi(query: string) {
  return query.includes('https://doi.org/');
}

const defaultRowsPerPage = 5;
const rowsPerPageOptions = [defaultRowsPerPage, defaultRowsPerPage * 2, defaultRowsPerPage * 4];

interface FindRegistrationProps {
  setSelectedRegistration: (registration: RegistrationSearchItem) => void;
  filteredRegistrationIdentifier: string;
  noHitsContent: ReactNode;
  initialQueryString?: string;
  fieldLabel?: string;
}

export const FindRegistration = ({
  setSelectedRegistration,
  filteredRegistrationIdentifier,
  fieldLabel,
  noHitsContent,
  initialQueryString = '',
}: FindRegistrationProps) => {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.user);

  const [searchBeforeDebounce, setSearchBeforeDebounce] = useState(initialQueryString);
  const debouncedSearch = useDebounce(searchBeforeDebounce);
  const queryIsDoi = isDoi(debouncedSearch);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);

  const fetchQuery: FetchResultsParams = {
    contributor: user?.cristinId ? getIdentifierFromId(user.cristinId) : null,
    doi: queryIsDoi ? debouncedSearch : null,
    query: !queryIsDoi ? debouncedSearch : null,
    idNot: filteredRegistrationIdentifier,
    results: rowsPerPage,
    from: page * rowsPerPage,
  };

  const searchQuery = useQuery({
    queryKey: ['registrations', fetchQuery],
    queryFn: () => fetchResults(fetchQuery),
    meta: { errorMessage: t('feedback.error.get_registrations') },
  });

  const searchResults = searchQuery.data?.hits ?? [];

  return (
    <Box component="search" sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <TextField
        data-testid={dataTestId.registrationLandingPage.tasksPanel.mergeRegistrationSearchField}
        placeholder={t('unpublish_actions.search_duplicate_facets')}
        variant="filled"
        label={fieldLabel ?? t('common.result')}
        onChange={(event) => setSearchBeforeDebounce(event.target.value)}
        value={searchBeforeDebounce}
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
        {searchQuery.isFetched && (
          <Typography gutterBottom>
            <strong>{t('basic_data.central_import.duplicate_search_hits')}</strong>
          </Typography>
        )}
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
          <div aria-live="polite" aria-busy={searchQuery.isFetching}>
            {searchQuery.isFetching ? (
              <ListSkeleton arrayLength={3} minWidth={40} height={100} />
            ) : searchResults.length === 0 ? (
              searchQuery.isFetched ? (
                noHitsContent
              ) : null
            ) : (
              <RadioGroup sx={{ my: '0.5rem' }}>
                {searchResults.map((registration) => {
                  const listItemId = `list-item-${registration.identifier}`;
                  return (
                    <Box key={registration.identifier} sx={{ display: 'flex', gap: '0.1rem' }}>
                      <Radio
                        data-testid={dataTestId.registrationLandingPage.tasksPanel.mergeRegistrationRadio(
                          registration.identifier
                        )}
                        sx={{ width: { xs: '1.5rem', sm: '2.5rem' } }}
                        onChange={() => setSelectedRegistration(registration)}
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
            )}
          </div>
        </ListPagination>
      </section>
    </Box>
  );
};
