import {
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { fetchOrganization } from '../../api/cristinApi';
import { fetchUsers } from '../../api/roleApi';
import { ListPagination } from '../../components/ListPagination';
import { RootState } from '../../redux/store';
import { alternatingTableRowColor } from '../../themes/mainTheme';
import { RoleName } from '../../types/user.types';
import { ROWS_PER_PAGE_OPTIONS } from '../../utils/constants';
import { getSortedSubUnits } from '../../utils/institutions-helpers';
import { ViewingScopeCell } from '../basic_data/institution_admin/ViewingScopeCell';
import { EditorThesisCuratorTableCell } from './EditorThesisCuratorTableCell';

export const EditorCurators = () => {
  const { t } = useTranslation();
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0]);
  const [page, setPage] = useState(1);

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
  const validPage = curators.length <= (page - 1) * rowsPerPage ? 1 : page;
  const curatorsOnPage = curators.slice((validPage - 1) * rowsPerPage, validPage * rowsPerPage);

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
      <TableContainer component={Paper} sx={{ mb: '0.5rem' }}>
        <Table size="small" sx={alternatingTableRowColor}>
          <TableHead>
            <TableRow>
              <TableCell>{t('common.name')}</TableCell>
              <TableCell>{t('editor.curators.area_of_responsibility')}</TableCell>
              <TableCell sx={{ width: 0 }}>{t('editor.curators.extended_area_of_resposibility')}</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {curatorsOnPage.map((curator) => (
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
      <ListPagination
        count={curators.length}
        rowsPerPage={rowsPerPage}
        page={validPage}
        onPageChange={(newPage) => setPage(newPage)}
        onRowsPerPageChange={(newRowsPerPage) => {
          setRowsPerPage(newRowsPerPage);
          setPage(1);
        }}
      />
    </>
  );
};
