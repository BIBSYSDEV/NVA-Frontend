import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFetchAllNviPeriodReports } from '../../../../api/hooks/useFetchAllNviPeriodReports';
import { ErrorBoundary } from '../../../../components/ErrorBoundary';
import { NviStatusMultiSelect } from '../../../../components/filters/nvi/NviStatusMultiSelect';
import { ListSkeleton } from '../../../../components/ListSkeleton';
import { MainContentLayout } from '../../../../components/page-layouts/MainContentLayout';
import { CenteredTableCell } from '../../../../components/tables/table-styles';
import { NviPeriod, NviPeriodReport } from '../../../../types/nvi.types';
import { UpsertNviPeriodDialog } from '../../../basic_data/app_admin/UpsertNviPeriodDialog';
import { CenteredPercentageControlledCell } from '../_styles/nvi-admin-table-styles';
import { NviAdminReportingPeriodsRow } from './_components/NviAdminReportingPeriodsRow';
import { useFilteredNviPeriods } from './_hooks/useFilteredNviPeriods';

export const NviPeriodsPage = () => {
  const { t } = useTranslation();
  const [nviPeriodToEdit, setNviPeriodToEdit] = useState<NviPeriod | null>(null);

  const { data, isPending, isError, refetch } = useFetchAllNviPeriodReports();
  const sortedPeriods = [...(data?.periods ?? [])].sort(
    (a: NviPeriodReport, b: NviPeriodReport) => +b.period.publishingYear - +a.period.publishingYear
  );
  const filteredPeriods = useFilteredNviPeriods(sortedPeriods);

  return (
    <MainContentLayout
      headTitle={t('basic_data.nvi.reporting_periods')}
      heading={t('basic_data.nvi.reporting_periods')}>
      <Typography sx={{ width: { md: '100%', lg: '50%' }, mb: '1rem' }}>{t('nvi_reporting_periods_text')}</Typography>
      <NviStatusMultiSelect />
      {isPending ? (
        <ListSkeleton height={100} minWidth={100} />
      ) : isError ? (
        <Typography>{t('feedback.error.get_nvi_periods')}</Typography>
      ) : filteredPeriods.length === 0 ? (
        <Typography>{t('common.no_hits')}</Typography>
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'white' }}>
              <TableCell>{t('nvi_year')}</TableCell>
              <TableCell>{t('common.start_date')}</TableCell>
              <TableCell>{t('common.end_date')}</TableCell>
              <CenteredTableCell>{t('number_of_candidates')}</CenteredTableCell>
              <CenteredTableCell>{t('nvi_points')}</CenteredTableCell>
              <CenteredPercentageControlledCell>{t('percentage_controlled')}</CenteredPercentageControlledCell>
              <TableCell>{t('status_for_period')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPeriods.map((nviPeriodReport: NviPeriodReport) => (
              <NviAdminReportingPeriodsRow
                nviPeriodReport={nviPeriodReport}
                key={nviPeriodReport.id}
                setNviPeriodToEdit={setNviPeriodToEdit}
              />
            ))}
          </TableBody>
        </Table>
      )}
      <ErrorBoundary>
        <UpsertNviPeriodDialog
          refetchNviPeriods={refetch}
          yearsWithPeriod={sortedPeriods.map(({ period }) => +period.publishingYear)}
          nviPeriod={nviPeriodToEdit}
          closeEditDialog={() => setNviPeriodToEdit(null)}
        />
      </ErrorBoundary>
    </MainContentLayout>
  );
};
