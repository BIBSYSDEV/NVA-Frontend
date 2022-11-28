import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { ROWS_PER_PAGE_OPTIONS } from '../../utils/constants';
import { alternatingTableRowColor } from '../../themes/mainTheme';
import { ViewingScopeCell } from '../basic_data/institution_admin/ViewingScopeCell';
import { RootState } from '../../redux/store';
import { useFetchResource } from '../../utils/hooks/useFetchResource';
import { Organization } from '../../types/organization.types';
import { getSortedSubUnits } from '../../utils/institutions-helpers';
import { RoleApiPath } from '../../api/apiPaths';
import { useFetch } from '../../utils/hooks/useFetch';
import { RoleName, UserList } from '../../types/user.types';
import { filterUsersByRole } from '../../utils/role-helpers';

export const EditorCurators = () => {
  const { t } = useTranslation();
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0]);
  const [page, setPage] = useState(0);

  const user = useSelector((store: RootState) => store.user);
  const [currentOrganization, isLoadingCurrentOrganization] = useFetchResource<Organization>(
    user?.topOrgCristinId ?? ''
  );
  const [institutionUsers, isLoading] = useFetch<UserList>({
    url: user?.customerId ? `${RoleApiPath.InstitutionUsers}?institution=${encodeURIComponent(user.customerId)}` : '',
    errorMessage: t('feedback.error.get_users_for_institution'),
    withAuthentication: true,
  });

  const curators = filterUsersByRole(institutionUsers?.users ?? [], RoleName.Curator);

  // Ensure selected page is not out of bounds due to manipulated userList
  const validPage = curators.length <= page * rowsPerPage ? 0 : page;

  const sortedList = curators.sort((a, b) =>
    `${a.givenName} ${a.familyName}`.toLocaleLowerCase() < `${b.givenName} ${b.familyName}`.toLocaleLowerCase() ? -1 : 1
  );

  return (
    <>
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
          <CircularProgress aria-label={t('editor.curators.areas_of_responsibility')} />
        </Box>
      ) : (
        <>
          {sortedList.length === 0 ? (
            <Typography>
              <i>{t('editor.curators.no_users_found')}</i>
            </Typography>
          ) : (
            <>
              <TableContainer component={Paper}>
                <Table size="small" sx={alternatingTableRowColor}>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('common.name')}</TableCell>
                      <TableCell sx={{ minWidth: { xs: '15rem', md: '40%' } }}>
                        {t('editor.curators.area_of_responsibility')}
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {sortedList.slice(validPage * rowsPerPage, validPage * rowsPerPage + rowsPerPage).map((curator) => {
                      return (
                        <TableRow key={curator.username}>
                          <TableCell>
                            {curator.givenName} {curator.familyName}
                          </TableCell>
                          <TableCell>
                            {isLoadingCurrentOrganization ? (
                              <CircularProgress />
                            ) : (
                              <ViewingScopeCell
                                user={curator}
                                options={currentOrganization ? getSortedSubUnits([currentOrganization]) : []}
                              />
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              {sortedList.length > ROWS_PER_PAGE_OPTIONS[0] && (
                <TablePagination
                  rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
                  component="div"
                  count={sortedList.length}
                  rowsPerPage={rowsPerPage}
                  page={validPage}
                  onPageChange={(_, newPage) => setPage(newPage)}
                  onRowsPerPageChange={(event) => {
                    setRowsPerPage(parseInt(event.target.value));
                    setPage(0);
                  }}
                />
              )}
            </>
          )}
        </>
      )}
    </>
  );
};
