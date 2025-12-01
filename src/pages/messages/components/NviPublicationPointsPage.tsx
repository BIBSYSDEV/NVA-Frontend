import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useFetchNviInstitutionStatus } from '../../../api/hooks/useFetchNviStatus';
import { useFetchOrganization } from '../../../api/hooks/useFetchOrganization';
import { RootState } from '../../../redux/store';
import { getDefaultNviYear } from '../../../utils/hooks/useNviCandidatesParams';
import { NviStatusWrapper } from './NviStatusWrapper';
import { NviPublicationPointsTableRow } from './NviPublicationPointsTableRow';

export const NviPublicationPointsPage = () => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const organizationQuery = useFetchOrganization(user?.topOrgCristinId ?? '');
  const institution = organizationQuery.data;
  const year = getDefaultNviYear();
  const nviStatusQuery = useFetchNviInstitutionStatus(year);
  const headline = t('tasks.nvi.reporting_status_for_publication_points_for_year', { year: year });

  return (
    <NviStatusWrapper headline={headline}>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow sx={{ whiteSpace: 'nowrap', bgcolor: 'white' }}>
              <TableCell sx={{ width: '80%' }}>{t('registration.contributors.department')}</TableCell>
              <TableCell>{t('tasks.nvi.status.Approved')}</TableCell>
              <TableCell>{t('tasks.nvi.publication_points')}</TableCell>
              <TableCell>
                <Box component="span" sx={visuallyHidden}>
                  {t('tasks.nvi.show_subunits')}
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {institution && (
              <NviPublicationPointsTableRow organization={institution} aggregations={nviStatusQuery.data} year={year} />
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </NviStatusWrapper>
  );
};
