import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNviPeriodReportNumbers } from '../../../../components/nvi/hooks/useNviPeriodReportNumbers';
import { NviPageLayout } from '../../../../components/nvi/NviPageLayout';
import { NviAdminTableSortSelector } from '../../../../components/nvi/table/NviAdminTableSortSelector';
import { NviAdminReportingStatusRow } from '../../../../components/nvi/table/rows/NviAdminReportingStatusRow';
import { NviAdminReportingStatusTexts } from '../../../../components/nvi/top-texts/NviAdminReportingStatusTexts';
import { TableSkeleton } from '../../../../components/skeletons/TableSkeleton';
import { NviAdminSortSelectorType } from '../../../../components/sort-selectors/sort-nvi-table/nvi-admin-sort-types';
import { VerticalBox } from '../../../../components/styled/Wrappers';
import { CenteredTableCell } from '../../../../components/tables/table-styles';
import { useInstitutionReportsFilteredAndSortedByUrl } from '../../../../hooks/nvi/useInstitutionReportsFilteredAndSortedByUrl';
import { InstitutionReport } from '../../../../types/nvi.types';
import { useNviCandidatesParams } from '../../../../utils/hooks/useNviCandidatesParams';

export const NviAdminReportingStatusPage = () => {
  const { t } = useTranslation();
  const { year } = useNviCandidatesParams();
  const { sortedAndFilteredData, isPending, isError } = useInstitutionReportsFilteredAndSortedByUrl(year);
  const {
    numCandidatesForReporting,
    percentageCandidatesComparedToPreviousYear,
    isPending: periodReportIsPending,
    isError: periodReportIsError,
  } = useNviPeriodReportNumbers(year);

  return (
    <NviPageLayout
      headline={t('basic_data.nvi.reporting_status')}
      topView={
        <NviAdminReportingStatusTexts
          previousYear={year - 1}
          isPending={periodReportIsPending}
          isError={periodReportIsError}
          totalResults={numCandidatesForReporting}
          percentage={percentageCandidatesComparedToPreviousYear}
        />
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
          <NviAdminTableSortSelector type={NviAdminSortSelectorType.Status} />
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow sx={{ whiteSpace: 'nowrap', bgcolor: 'white' }}>
                  <TableCell sx={{ width: '30%' }}>{t('common.institution')}</TableCell>
                  <TableCell sx={{ width: '20%' }}>{t('sector')}</TableCell>
                  <CenteredTableCell>{t('candidate')}</CenteredTableCell>
                  <CenteredTableCell>{t('controlling')}</CenteredTableCell>
                  <CenteredTableCell>{t('approved')}</CenteredTableCell>
                  <CenteredTableCell>{t('rejected')}</CenteredTableCell>
                  <CenteredTableCell>{t('disputes')}</CenteredTableCell>
                  <CenteredTableCell>{t('common.total_number')}</CenteredTableCell>
                  <CenteredTableCell>{t('percentage_controlled')}</CenteredTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedAndFilteredData.map((report: InstitutionReport) => (
                  <NviAdminReportingStatusRow report={report} key={report.id} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </VerticalBox>
      )}
    </NviPageLayout>
  );
};
