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
import { NviStatusTableRow } from './NviStatusTableRow';

interface NviStatusPageProps {
  activeYear?: number;
}

export const NviStatusPage = ({ activeYear }: NviStatusPageProps) => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);

  const organizationQuery = useFetchOrganization(user?.topOrgCristinId ?? '');
  const institution = organizationQuery.data;

  const nviQuery = useFetchNviCandidates({
    params: { size: 1, aggregation: 'organizationApprovalStatuses', year: activeYear ?? 2023 },
  });
  const aggregationKeys = Object.keys(nviQuery.data?.aggregations?.organizationApprovalStatuses ?? {});
  const aggregationKey = aggregationKeys.find((key) => isValidUrl(key));
  const nviAggregations = nviQuery.data?.aggregations?.organizationApprovalStatuses[aggregationKey ?? ''] as
    | OrganizationApprovalStatusDetail
    | undefined;

  return (
    <BackgroundDiv>
      <Typography variant="h1" gutterBottom>
        {t('tasks.nvi.institution_nvi_status')}
      </Typography>

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
