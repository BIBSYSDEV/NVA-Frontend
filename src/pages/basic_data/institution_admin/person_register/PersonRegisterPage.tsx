import {
  CircularProgress,
  InputAdornment,
  Paper,
  Skeleton,
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
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { fetchEmployees } from '../../../../api/searchApi';
import { ErrorBoundary } from '../../../../components/ErrorBoundary';
import { ListPagination } from '../../../../components/ListPagination';
import { BackgroundDiv } from '../../../../components/styled/Wrappers';
import { RootState } from '../../../../redux/store';
import { alternatingTableRowColor } from '../../../../themes/mainTheme';
import { ROWS_PER_PAGE_OPTIONS } from '../../../../utils/constants';
import { dataTestId } from '../../../../utils/dataTestIds';
import { useDebounce } from '../../../../utils/hooks/useDebounce';
import { PersonTableRow } from './PersonTableRow';

export const PersonRegisterPage = () => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);

  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0]);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearchQuery]);

  const employeeSearchQuery = useQuery({
    enabled: !!user?.topOrgCristinId && debouncedSearchQuery === searchQuery,
    queryKey: ['employees', user?.topOrgCristinId, rowsPerPage, page, debouncedSearchQuery, searchQuery],
    queryFn: ({ signal }) =>
      user?.topOrgCristinId
        ? fetchEmployees(user?.topOrgCristinId, rowsPerPage, page, debouncedSearchQuery, signal)
        : null,
    meta: { errorMessage: t('feedback.error.get_users_for_institution') },
    placeholderData: keepPreviousData,
  });

  const employees = employeeSearchQuery.data?.hits ?? [];

  return (
    <BackgroundDiv>
      <Helmet>
        <title>{t('basic_data.person_register.person_register')}</title>
      </Helmet>

      <TextField
        data-testid={dataTestId.basicData.personRegisterSearchBar}
        type="search"
        variant="filled"
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        label={t('common.search_by_name')}
        fullWidth
        sx={{ mb: '1rem', maxWidth: '25rem' }}
        slotProps={{
          input: {
            endAdornment: employeeSearchQuery.isFetching && (
              <InputAdornment position="end">
                <CircularProgress size={20} aria-labelledby="search-by-name-label" />
              </InputAdornment>
            ),
          },
          inputLabel: { id: 'search-by-name-label' },
        }}
      />

      <ListPagination
        count={employeeSearchQuery.data?.size ?? 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(newPage) => setPage(newPage)}
        onRowsPerPageChange={(newRowsPerPage) => {
          setRowsPerPage(newRowsPerPage);
          setPage(1);
        }}>
        {employees.length === 0 && !employeeSearchQuery.isPending ? (
          <Typography>{t('basic_data.person_register.no_employees_found')}</Typography>
        ) : (
          <TableContainer component={Paper} sx={{ mb: '0.5rem' }}>
            <Table size="small" sx={alternatingTableRowColor}>
              <caption style={visuallyHidden}>{t('basic_data.person_register.employee_table_caption')}</caption>
              <TableHead>
                <TableRow>
                  <TableCell>{t('basic_data.person_register.person_id')}</TableCell>
                  <TableCell>{t('common.national_id_number')}</TableCell>
                  <TableCell>{t('common.name')}</TableCell>
                  <TableCell>{t('common.employments')}</TableCell>
                  <TableCell>
                    <span style={visuallyHidden}>{t('common.actions')}</span>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employeeSearchQuery.isPending
                  ? [...Array(5)].map((_, index) => (
                      <TableRow key={index} sx={{ height: '4rem' }}>
                        <TableCell>
                          <Skeleton />
                        </TableCell>
                        <TableCell>
                          <Skeleton />
                        </TableCell>
                        <TableCell width="25%">
                          <Skeleton />
                        </TableCell>
                        <TableCell width="60%">
                          <Skeleton />
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    ))
                  : employees.map((person) => (
                      <ErrorBoundary key={person.id}>
                        <PersonTableRow cristinPerson={person} refetchEmployees={employeeSearchQuery.refetch} />
                      </ErrorBoundary>
                    ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </ListPagination>
    </BackgroundDiv>
  );
};
