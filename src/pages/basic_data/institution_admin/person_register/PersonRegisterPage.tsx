import {
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { alternatingTableRowColor } from '../../../../themes/mainTheme';
import { SearchResponse } from '../../../../types/common.types';
import { CristinPerson } from '../../../../types/user.types';
import { useFetch } from '../../../../utils/hooks/useFetch';
import { PersonTableRow } from './PersonTableRow';

const rowsPerPageOptions = [10, 25, 50];

export const PersonRegisterPage = () => {
  const { t } = useTranslation('basicData');
  const user = useSelector((store: RootState) => store.user);

  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  const [page, setPage] = useState(1);

  const url = user?.topOrgCristinId ? `${user.topOrgCristinId}/persons?page=${page}&results=${rowsPerPage}` : '';
  const [employeesSearchResponse, isLoadingEmployees] = useFetch<SearchResponse<CristinPerson>>({
    url,
    errorMessage: t('feedback:error.get_users_for_institution'),
  });
  const employees = employeesSearchResponse?.hits ?? [];

  return isLoadingEmployees ? (
    <Box sx={{ mt: '5rem', display: 'flex', justifyContent: 'space-around' }}>
      <CircularProgress size={60} />
    </Box>
  ) : employees.length === 0 ? (
    <Typography>{t('person_register.no_employees_found')}</Typography>
  ) : (
    <>
      <Table size="small" sx={alternatingTableRowColor}>
        <caption style={visuallyHidden}>{t('person_register.employee_table_caption')}</caption>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography fontWeight="bold">{t('person_register.person_id')}</Typography>
            </TableCell>
            <TableCell>
              <Typography fontWeight="bold">{t('common:name')}</Typography>
            </TableCell>
            <TableCell>
              <Typography fontWeight="bold">{t('employments')}</Typography>
            </TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {employees.map((person) => (
            <PersonTableRow
              key={person.id}
              cristinPerson={person}
              topOrgCristinIdentifier={user?.topOrgCristinId ? user.topOrgCristinId.split('/').pop() ?? '' : ''}
            />
          ))}
        </TableBody>
      </Table>
      {employeesSearchResponse && employeesSearchResponse.size > rowsPerPageOptions[0] && (
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={employeesSearchResponse.size}
          rowsPerPage={rowsPerPage}
          page={page - 1}
          onPageChange={(_, muiPage) => setPage(muiPage + 1)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value));
            setPage(1);
          }}
        />
      )}
    </>
  );
};
