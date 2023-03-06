import {
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { alternatingTableRowColor } from '../../../../themes/mainTheme';
import { SearchResponse } from '../../../../types/common.types';
import { CristinPerson } from '../../../../types/user.types';
import { useDebounce } from '../../../../utils/hooks/useDebounce';
import { useFetch } from '../../../../utils/hooks/useFetch';
import { PersonTableRow } from './PersonTableRow';

const rowsPerPageOptions = [10, 25, 50];

const getSearchUrl = (topOrgCristinId: string | undefined, nameQuery: string, page: number, rowsPerPage: number) => {
  const nameQueryParam = nameQuery ? `&name=${nameQuery}` : '';
  return topOrgCristinId ? `${topOrgCristinId}/persons?page=${page}&results=${rowsPerPage}${nameQueryParam}` : '';
};

export const PersonRegisterPage = () => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);

  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery);

  const prevSearchQueryRef = useRef(debouncedSearchQuery);

  useEffect(() => {
    // Reset page every time the search query changes
    if (prevSearchQueryRef.current !== debouncedSearchQuery) {
      setPage(1);
      prevSearchQueryRef.current = debouncedSearchQuery;
    }
  }, [debouncedSearchQuery]);

  const [employeesSearchResponse, isLoadingEmployees, refetchEmployees] = useFetch<SearchResponse<CristinPerson>>({
    url: getSearchUrl(
      user?.topOrgCristinId,
      debouncedSearchQuery,
      prevSearchQueryRef.current !== debouncedSearchQuery ? 1 : page,
      rowsPerPage
    ),
    withAuthentication: true,
    errorMessage: t('feedback.error.get_users_for_institution'),
  });
  const employees = employeesSearchResponse?.hits ?? [];

  return (
    <>
      <Helmet>
        <title>{t('basic_data.person_register.person_register')}</title>
      </Helmet>

      <TextField
        type="search"
        variant="filled"
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        label={t('common.search_by_name')}
        fullWidth
        sx={{ mb: '1rem', maxWidth: '25rem' }}
      />

      {employees.length === 0 && !isLoadingEmployees ? (
        <Typography>{t('basic_data.person_register.no_employees_found')}</Typography>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table size="small" sx={alternatingTableRowColor}>
              <caption style={visuallyHidden}>{t('basic_data.person_register.employee_table_caption')}</caption>
              <TableHead>
                <TableRow>
                  <TableCell>{t('basic_data.person_register.person_id')}</TableCell>
                  <TableCell>{t('basic_data.person_register.national_identity_number')}</TableCell>
                  <TableCell>{t('common.name')}</TableCell>
                  <TableCell>{t('common.employments')}</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoadingEmployees
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
                      <PersonTableRow
                        key={person.id}
                        cristinPerson={person}
                        topOrgCristinIdentifier={
                          user?.topOrgCristinId ? user.topOrgCristinId.split('/').pop() ?? '' : ''
                        }
                        customerId={user?.customerId ?? ''}
                        refetchEmployees={refetchEmployees}
                      />
                    ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={rowsPerPageOptions}
            count={employeesSearchResponse?.size ?? -1}
            rowsPerPage={rowsPerPage}
            page={page - 1}
            onPageChange={(_, muiPage) => setPage(muiPage + 1)}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value));
              setPage(1);
            }}
          />
        </>
      )}
    </>
  );
};
