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
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { AffiliationHierarchy } from '../../../components/institution/AffiliationHierarchy';
import { RootState } from '../../../redux/store';
import { alternatingTableRowColor } from '../../../themes/mainTheme';
import { SearchResponse } from '../../../types/common.types';
import { CristinUser } from '../../../types/user.types';
import { useFetch } from '../../../utils/hooks/useFetch';
import { convertToFlatCristinUser, filterActiveAffiliations } from '../../../utils/user-helpers';

const rowsPerPageOptions = [10, 25, 50];

export const PersonRegisterPage = () => {
  const { t } = useTranslation('basicData');
  const user = useSelector((store: RootState) => store.user);

  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  const [page, setPage] = useState(1);

  const url = user?.topOrgCristinId ? `${user.topOrgCristinId}/persons?page=${page}&results=${rowsPerPage}` : '';
  const [employeesSearchResponse, isLoadingEmployees] = useFetch<SearchResponse<CristinUser>>({
    url,
    errorMessage: 'TODO',
  });
  const employees = employeesSearchResponse?.hits ?? [];

  return isLoadingEmployees ? (
    <Box sx={{ mt: '5rem', display: 'flex', justifyContent: 'space-around' }}>
      <CircularProgress size={60} />
    </Box>
  ) : employees.length === 0 ? (
    <Typography>
      <i>{t('users.no_users_found')}</i>
    </Typography>
  ) : (
    <>
      <Table size="small" sx={alternatingTableRowColor}>
        {/* <caption style={visuallyHidden}>{tableCaption}</caption> */}
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
          </TableRow>
        </TableHead>
        <TableBody>
          {employees.map((person) => {
            const flatCristinPerson = convertToFlatCristinUser(person);
            const activeEmployments = filterActiveAffiliations(flatCristinPerson.affiliations);
            return (
              <TableRow key={flatCristinPerson.cristinIdentifier}>
                <TableCell>{flatCristinPerson.cristinIdentifier}</TableCell>
                <TableCell>
                  {flatCristinPerson.firstName} {flatCristinPerson.lastName}
                </TableCell>
                <TableCell>
                  {activeEmployments.map((employment) => (
                    <AffiliationHierarchy
                      key={employment.organization}
                      unitUri={employment.organization}
                      commaSeparated
                    />
                  ))}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {employeesSearchResponse && employeesSearchResponse.size > rowsPerPageOptions[0] && (
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={employeesSearchResponse.size}
          rowsPerPage={rowsPerPage}
          page={page - 1}
          onPageChange={(_, newPage) => setPage(newPage + 1)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value));
            setPage(1);
          }}
        />
      )}
    </>
  );
};
