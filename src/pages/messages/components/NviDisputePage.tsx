import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useFetchNviInstitutionStatus } from '../../../api/hooks/useFetchNviStatus';
import { useFetchOrganization } from '../../../api/hooks/useFetchOrganization';
import { RootState } from '../../../redux/store';
import { useNviCandidatesParams } from '../../../utils/hooks/useNviCandidatesParams';
import { NviStatusWrapper } from './NviStatusWrapper';
import { NviDisputeTableRow } from './NviDisputeTableRow';

export const NviDisputePage = () => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const organizationQuery = useFetchOrganization(user?.topOrgCristinId ?? '');
  const institution = organizationQuery.data;
  const { year } = useNviCandidatesParams();
  const nviStatusQuery = useFetchNviInstitutionStatus(year);

  return (
    <NviStatusWrapper headline={t('tasks.nvi.disputes_divided_on_units')}>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow sx={{ whiteSpace: 'nowrap', bgcolor: 'white' }}>
              <TableCell>{t('registration.contributors.department')}</TableCell>
              <TableCell>{t('tasks.nvi.total_amount_of_disputes')}</TableCell>
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
              <NviDisputeTableRow
                organization={institution}
                aggregations={nviStatusQuery.data}
                user={user}
                year={year}
              />
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </NviStatusWrapper>
  );
};
