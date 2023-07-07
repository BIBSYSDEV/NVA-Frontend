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
import { useQuery } from '@tanstack/react-query';
import { ROWS_PER_PAGE_OPTIONS } from '../../utils/constants';
import { alternatingTableRowColor } from '../../themes/mainTheme';
import { ViewingScopeCell } from '../basic_data/institution_admin/ViewingScopeCell';
import { RootState } from '../../redux/store';
import { getSortedSubUnits } from '../../utils/institutions-helpers';
import { RoleName } from '../../types/user.types';
import { fetchUsers } from '../../api/roleApi';
import { fetchOrganization } from '../../api/cristinApi';
import { EditorThesisCuratorTableCell } from './EditorThesisCuratorTableCell';

export const EditorCurators = () => {
  const { t } = useTranslation();
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[1]);
  const [page, setPage] = useState(0);

  const user = useSelector((store: RootState) => store.user);
  const topOrgCristinId = user?.topOrgCristinId ?? '';
  const customerId = user?.customerId ?? '';

  const organizationQuery = useQuery({
    enabled: !!topOrgCristinId,
    queryKey: [topOrgCristinId],
    queryFn: () => fetchOrganization(topOrgCristinId),
    meta: { errorMessage: t('feedback.error.get_institution') },
    staleTime: Infinity,
    cacheTime: 1_800_000, // 30 minutes
  });
  const currentOrganization = organizationQuery.data;

  const curatorsQuery = useQuery({
    queryKey: ['curators', customerId],
    enabled: !!customerId,
    queryFn: () => (customerId ? fetchUsers(customerId, RoleName.Curator) : undefined),
    meta: { errorMessage: t('feedback.error.get_users_for_institution') },
  });
  const curators = curatorsQuery.data ?? [];

  // Ensure selected page is not out of bounds due to manipulated userList
  const validPage = curators.length <= page * rowsPerPage ? 0 : page;

  return curatorsQuery.isLoading || organizationQuery.isLoading ? (
    <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: '2rem' }}>
      <CircularProgress aria-label={t('editor.curators.areas_of_responsibility')} />
    </Box>
  ) : curators.length === 0 ? (
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
              <TableCell>{t('editor.curators.area_of_responsibility')}</TableCell>
              <TableCell sx={{ width: 0 }}>{t('editor.curators.extended_area_of_resposibility')}</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {curators.slice(validPage * rowsPerPage, validPage * rowsPerPage + rowsPerPage).map((curator) => (
              <TableRow key={curator.username}>
                <TableCell>
                  {curator.givenName} {curator.familyName}
                </TableCell>
                <TableCell>
                  <ViewingScopeCell
                    user={curator}
                    options={currentOrganization ? getSortedSubUnits([currentOrganization]) : []}
                  />
                </TableCell>
                <EditorThesisCuratorTableCell curator={curator} />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
        component="div"
        count={curators.length}
        rowsPerPage={rowsPerPage}
        page={validPage}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value));
          setPage(0);
        }}
      />
    </>
  );
};
