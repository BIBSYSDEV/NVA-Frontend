import {
  Box,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
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
import OrcidLogo from '../../../resources/images/orcid_logo.svg';
import { ORCID_BASE_URL } from '../../../utils/constants';

const rowsPerPageOptions = [10, 25, 50];

export const PersonRegisterPage = () => {
  const { t } = useTranslation('basicData');
  const user = useSelector((store: RootState) => store.user);

  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  const [page, setPage] = useState(1);

  const url = user?.topOrgCristinId ? `${user.topOrgCristinId}/persons?page=${page}&results=${rowsPerPage}` : '';
  const [employeesSearchResponse, isLoadingEmployees] = useFetch<SearchResponse<CristinUser>>({
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
          </TableRow>
        </TableHead>
        <TableBody>
          {employees.map((person) => {
            const { cristinIdentifier, firstName, lastName, affiliations, orcid } = convertToFlatCristinUser(person);
            const activeEmployments = filterActiveAffiliations(affiliations);
            const orcidUrl = orcid ? `${ORCID_BASE_URL}/${orcid}` : '';
            return (
              <TableRow key={cristinIdentifier}>
                <TableCell>{cristinIdentifier}</TableCell>
                <TableCell>
                  {firstName} {lastName}
                  {orcidUrl && (
                    <Tooltip title={t<string>('common:orcid_profile')}>
                      <IconButton size="small" href={orcidUrl} target="_blank">
                        <img src={OrcidLogo} height="20" alt="orcid" />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
                <TableCell>
                  <Box component="ul" sx={{ p: 0 }}>
                    {activeEmployments.map((employment, index) => (
                      <Box key={`${employment.organization}-${index}`} component="li" sx={{ display: 'flex' }}>
                        <AffiliationHierarchy unitUri={employment.organization} commaSeparated />
                      </Box>
                    ))}
                  </Box>
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
