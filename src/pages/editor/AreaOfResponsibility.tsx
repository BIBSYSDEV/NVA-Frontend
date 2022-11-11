import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
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
import { UserList } from '../../types/user.types';

export const AreaOfResponsibility = () => {
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
  const users = institutionUsers?.users ?? [];

  // Ensure selected page is not out of bounds due to manipulated userList
  const validPage = users.length <= page * rowsPerPage ? 0 : page;

  const sortedList = users.sort((a, b) =>
    `${a.givenName} ${a.familyName}`.toLocaleLowerCase() < `${b.givenName} ${b.familyName}`.toLocaleLowerCase() ? -1 : 1
  );

  return (
    <>
      {isLoading ? (
        <CircularProgress sx={{ margin: 'auto' }} />
      ) : (
        <>
          {sortedList.length === 0 ? (
            <Typography>
              <i>{t('basic_data.users.no_users_found')}</i>
            </Typography>
          ) : (
            <>
              <Table size="small" sx={alternatingTableRowColor}>
                {/* <caption style={visuallyHidden}>{tableCaption}</caption> */}
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography fontWeight="bold">{t('common.name')}</Typography>
                    </TableCell>
                    <TableCell sx={{ minWidth: { xs: '15rem', md: '40%' } }}>
                      <Typography fontWeight="bold">{t('basic_data.users.area_of_responsibility')}</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {sortedList.slice(validPage * rowsPerPage, validPage * rowsPerPage + rowsPerPage).map((user) => {
                    return (
                      <TableRow key={user.username}>
                        <TableCell>
                          {user.givenName} {user.familyName}
                        </TableCell>
                        <TableCell>
                          {isLoadingCurrentOrganization ? (
                            <CircularProgress />
                          ) : (
                            <ViewingScopeCell
                              user={user}
                              options={currentOrganization ? getSortedSubUnits([currentOrganization]) : []}
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
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
