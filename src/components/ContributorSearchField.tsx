import SearchIcon from '@mui/icons-material/Search';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFetchPerson } from '../api/hooks/useFetchPerson';
import { CristinPersonTableRow } from '../pages/registration/contributors_tab/components/AddContributorTableRow';
import { CristinPerson } from '../types/user.types';
import { ROWS_PER_PAGE_OPTIONS } from '../utils/constants';
import { dataTestId } from '../utils/dataTestIds';
import { useDebounce } from '../utils/hooks/useDebounce';
import { ListPagination } from './ListPagination';
import { ListSkeleton } from './ListSkeleton';

interface ContributorSearchFieldProps {
  selectedPerson?: CristinPerson;
  setSelectedPerson: (val: CristinPerson | undefined) => void;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  singleSelectAffiliations?: boolean;
}

export const ContributorSearchField = ({
  selectedPerson,
  setSelectedPerson,
  searchTerm,
  setSearchTerm,
  singleSelectAffiliations = false,
}: ContributorSearchFieldProps) => {
  const { t } = useTranslation();
  const debouncedSearchTerm = useDebounce(searchTerm);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0]);
  const personQuery = useFetchPerson(debouncedSearchTerm, rowsPerPage, page, t('feedback.error.search'));
  const userSearch = personQuery.data?.hits ?? [];

  return (
    <>
      <TextField
        type="search"
        data-testid={dataTestId.registrationWizard.contributors.searchField}
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(event) => {
          setSearchTerm(event.target.value);
          if (page !== 1) {
            setPage(1);
          }
        }}
        placeholder={t('common.search_placeholder')}
        label={t('common.search')}
        InputProps={{
          startAdornment: <SearchIcon />,
        }}
        sx={{ my: '1rem' }}
      />
      {personQuery.isFetching ? (
        <ListSkeleton arrayLength={3} minWidth={100} height={80} />
      ) : userSearch && personQuery.data && personQuery.data.size > 0 && debouncedSearchTerm ? (
        <ListPagination
          count={personQuery.data.size}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={setPage}
          onRowsPerPageChange={(newRowsPerPage) => {
            setRowsPerPage(newRowsPerPage);
            setPage(1);
          }}
          showPaginationTop>
          <TableContainer component={Paper} sx={{ my: '0.5rem' }} elevation={3}>
            <Table size="medium">
              <caption style={visuallyHidden}>{t('search.persons')}</caption>
              <TableHead>
                <TableRow>
                  <TableCell width="20%">{t('common.person')}</TableCell>
                  <TableCell width="45%">{t('my_page.my_profile.heading.affiliations')}</TableCell>
                  <TableCell width="25%">{t('common.result_registrations')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {personQuery.data.hits.map((cristinPerson) => (
                  <CristinPersonTableRow
                    key={cristinPerson.id}
                    cristinPerson={cristinPerson}
                    setSelectedPerson={setSelectedPerson}
                    selectedPerson={selectedPerson}
                    singleSelectAffiliations={singleSelectAffiliations}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </ListPagination>
      ) : (
        debouncedSearchTerm && <Typography>{t('common.no_hits')}</Typography>
      )}
    </>
  );
};
