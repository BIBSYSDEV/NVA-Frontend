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
import { Trans, useTranslation } from 'react-i18next';
import { useGetUrlFilteredInstitutionReports } from '../../../api/hooks/useGetUrlFilteredInstitutionReports';
import { useSortInstitutionReports } from '../../../api/hooks/useSortInstitutionReports';
import { PercentageWithIcon } from '../../../components/atoms/PercentageWithIcon';
import { TableSkeleton } from '../../../components/skeletons/TableSkeleton';
import { HorizontalBox, VerticalBox } from '../../../components/styled/Wrappers';
import { InstitutionReport } from '../../../types/nvi.types';
import { NviStatusWrapper } from '../../messages/components/NviStatusWrapper';
import {
  getNviApprovedCount,
  getNviCandidatesCount,
  getNviInstitutionName,
  getNviRejectedCount,
  getNviSectorLabel,
  getNviTotalCount,
} from './nviAdmin/nviAdminHelpers';
import { NviAdminSortSelector, NviAdminSortSelectorType } from './nviAdmin/nviAdminSortSelector/NviAdminSortSelector';

export const NviAdminStatusPage = () => {
  const { t } = useTranslation();
  const { filteredData, isPending, isError } = useGetUrlFilteredInstitutionReports();
  const sortedData = useSortInstitutionReports(filteredData);

  return (
    <NviStatusWrapper
      headline={t('basic_data.nvi.reporting_status')}
      topView={
        <Box sx={{ mb: '1rem' }}>
          <Trans
            t={t}
            i18nKey="basic_data.nvi.reporting_status_description"
            components={{ p: <Typography gutterBottom /> }}
          />
        </Box>
      }
      yearSelector
      sectorSelector
      institutionSearch>
      {isPending ? (
        <TableSkeleton />
      ) : isError ? (
        <Typography>{t('feedback.error.get_nvi_reports')}</Typography>
      ) : (
        <VerticalBox sx={{ width: '100%' }}>
          <NviAdminSortSelector type={NviAdminSortSelectorType.Status} />
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow sx={{ whiteSpace: 'nowrap', bgcolor: 'white' }}>
                  <TableCell>{t('common.institution')}</TableCell>
                  <TableCell>{t('sector')}</TableCell>
                  <TableCell>{t('candidate')}</TableCell>
                  <TableCell>{t('controlling')}</TableCell>
                  <TableCell>{t('approved')}</TableCell>
                  <TableCell>{t('rejected')}</TableCell>
                  <TableCell>{t('disputes')}</TableCell>
                  <TableCell>{t('common.total_number')}</TableCell>
                  <TableCell>{t('percentage_controlled')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedData.map((report: InstitutionReport) => {
                  const { id, institutionSummary } = report;
                  const { byLocalApprovalStatus, totals } = institutionSummary;
                  const percentageControlled =
                    totals.undisputedTotalCount > 0
                      ? (byLocalApprovalStatus.approved + byLocalApprovalStatus.rejected) / totals.undisputedTotalCount
                      : 0;

                  return (
                    <TableRow key={id} sx={{ height: '4rem' }}>
                      <TableCell>{getNviInstitutionName(report)}</TableCell>
                      <TableCell>{getNviSectorLabel(report, t)}</TableCell>
                      <TableCell align="center">{getNviCandidatesCount(report)}</TableCell>
                      <TableCell align="center">{byLocalApprovalStatus.pending}</TableCell>
                      <TableCell align="center">{getNviApprovedCount(report)}</TableCell>
                      <TableCell align="center">{getNviRejectedCount(report)}</TableCell>
                      <TableCell align="center">{totals.disputedCount}</TableCell>
                      <TableCell align="center">{getNviTotalCount(report)}</TableCell>
                      <TableCell align="center">
                        <HorizontalBox sx={{ justifyContent: 'center' }}>
                          <PercentageWithIcon
                            displayPercentage={Math.floor(percentageControlled * 100)}
                            alternativeIfZero={'-'}
                          />
                        </HorizontalBox>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </VerticalBox>
      )}
    </NviStatusWrapper>
  );
};
