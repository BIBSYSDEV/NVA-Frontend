import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useFetchNviCandidates } from '../../../api/hooks/useFetchNviCandidates';
import { useFetchOrganization } from '../../../api/hooks/useFetchOrganization';
import { BackgroundDiv } from '../../../components/styled/Wrappers';
import { RootState } from '../../../redux/store';
import { OrganizationApprovalStatusDetail } from '../../../types/nvi.types';
import { isValidUrl } from '../../../utils/general-helpers';
import { useNviCandidatesParams } from '../../../utils/hooks/useNviCandidatesParams';
import { ExportNviButton } from './ExportNviButton';
import { NviStatusTableRow } from './NviStatusTableRow';
import { NviYearSelector } from './NviYearSelector';

export const NviStatusPage = () => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);

  const organizationQuery = useFetchOrganization(user?.topOrgCristinId ?? '');
  const institution = organizationQuery.data;

  const { year } = useNviCandidatesParams();

  const nviQuery = useFetchNviCandidates({
    params: { size: 1, aggregation: 'organizationApprovalStatuses', year },
  });
  const aggregationKeys = Object.keys(nviQuery.data?.aggregations?.organizationApprovalStatuses ?? {});
  const aggregationKey = aggregationKeys.find((key) => isValidUrl(key));
  const nviAggregations = nviQuery.data?.aggregations?.organizationApprovalStatuses[aggregationKey ?? ''] as
    | OrganizationApprovalStatusDetail
    | undefined;

  return (
    <BackgroundDiv sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Typography variant="h1">{t('tasks.nvi.institution_nvi_status')}</Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <NviYearSelector />
        <ExportNviButton year={year} />
      </Box>

      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow sx={{ whiteSpace: 'nowrap', bgcolor: '#FEFBF3' }}>
              <TableCell>{t('registration.contributors.department')}</TableCell>
              <TableCell>{t('tasks.nvi.status.New')}</TableCell>
              <TableCell>{t('tasks.nvi.status.Pending')}</TableCell>
              <TableCell>{t('tasks.nvi.status.Approved')}</TableCell>
              <TableCell>{t('tasks.nvi.status.Rejected')}</TableCell>
              <TableCell>{t('common.total_number')}</TableCell>
              <TableCell>{t('tasks.nvi.publication_points')}</TableCell>
              <TableCell>{t('tasks.nvi.status.Dispute')}</TableCell>
              <TableCell>
                <Box component="span" sx={visuallyHidden}>
                  {t('tasks.nvi.show_subunits')}
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {institution && <NviStatusTableRow organization={institution} aggregations={nviAggregations} />}
          </TableBody>
        </Table>
      </TableContainer>
    </BackgroundDiv>
  );
};
