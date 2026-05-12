import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFetchNviPeriods } from '../../../../api/hooks/useFetchNviPeriods';
import { ErrorBoundary } from '../../../../components/ErrorBoundary';
import { ListSkeleton } from '../../../../components/ListSkeleton';
import { MainContentLayout } from '../../../../components/page-layouts/MainContentLayout';
import { NviPeriod } from '../../../../types/nvi.types';
import { UpsertNviPeriodDialog } from '../../../basic_data/app_admin/UpsertNviPeriodDialog';
import { NviAdminReportingPeriodsRow } from './_components/NviAdminReportingPeriodsRow';
import { NviStatusMultiSelect } from './_components/NviStatusMultiSelect';

export const NviPeriodsPage = () => {
  const { t } = useTranslation();
  const [nviPeriodToEdit, setNviPeriodToEdit] = useState<NviPeriod | null>(null);

  const { data, isPending, refetch } = useFetchNviPeriods();
  const sortedPeriods = data?.periods.sort((a, b) => +b.publishingYear - +a.publishingYear) ?? [];

  return (
    <MainContentLayout
      headtitle={t('basic_data.nvi.reporting_periods')}
      headline={t('basic_data.nvi.reporting_periods')}>
      <Typography sx={{ width: { md: '100%', lg: '50%' } }}>{t('nvi_reporting_periods_text')}</Typography>
      <NviStatusMultiSelect />
      {isPending ? (
        <ListSkeleton height={100} minWidth={100} />
      ) : sortedPeriods.length === 0 ? (
        <Typography>{t('common.no_hits')}</Typography>
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'white' }}>
              <TableCell>{t('nvi_year')}</TableCell>
              <TableCell>{t('common.start_date')}</TableCell>
              <TableCell>{t('common.end_date')}</TableCell>
              <TableCell>{t('number_of_candidates')}</TableCell>
              <TableCell>{t('nvi_points')}</TableCell>
              <TableCell>{t('percentage_controlled')}</TableCell>
              <TableCell>{t('status_for_period')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedPeriods.map((nviPeriod) => (
              <NviAdminReportingPeriodsRow nviPeriod={nviPeriod} key={nviPeriod.publishingYear} />
            ))}
          </TableBody>
        </Table>
      )}
      <ErrorBoundary>
        <UpsertNviPeriodDialog
          refetchNviPeriods={refetch}
          yearsWithPeriod={sortedPeriods.map(({ publishingYear }) => +publishingYear)}
          nviPeriod={nviPeriodToEdit}
          closeEditDialog={() => setNviPeriodToEdit(null)}
        />
      </ErrorBoundary>
    </MainContentLayout>
  );
};
