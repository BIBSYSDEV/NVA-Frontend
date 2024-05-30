import { Box, List, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFetchNviPeriods } from '../../../api/hooks/useFetchNviPeriods';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { ListSkeleton } from '../../../components/ListSkeleton';
import { SearchListItem } from '../../../components/styled/Wrappers';
import { NviPeriod } from '../../../types/nvi.types';
import { toDateString } from '../../../utils/date-helpers';
import { UpsertNviPeriodDialog } from './UpsertNviPeriodDialog';

export const NviPeriodsPage = () => {
  const { t } = useTranslation();

  const [nviPeriodToEdit, setNviPeriodToEdit] = useState<NviPeriod | null>(null);

  const nviPeriodsQuery = useFetchNviPeriods();

  const sortedPeriods = nviPeriodsQuery.data?.periods.sort((a, b) => +b.publishingYear - +a.publishingYear) ?? [];

  return (
    <Box component="section">
      {nviPeriodsQuery.isPending ? (
        <ListSkeleton height={100} minWidth={100} />
      ) : sortedPeriods.length === 0 ? (
        <Typography>{t('common.no_hits')}</Typography>
      ) : (
        <List disablePadding>
          {sortedPeriods.map((nviPeriod) => {
            const startDateString = nviPeriod.startDate
              ? `${toDateString(nviPeriod.startDate)} (${new Date(nviPeriod.startDate).toLocaleTimeString()})`
              : '?';
            const endDateString = nviPeriod.reportingDate
              ? `${toDateString(nviPeriod.reportingDate)} (${new Date(nviPeriod.reportingDate).toLocaleTimeString()})`
              : '?';

            return (
              <SearchListItem
                key={nviPeriod.publishingYear}
                sx={{ borderLeftColor: 'nvi.main', cursor: 'pointer' }}
                onClick={() => setNviPeriodToEdit(nviPeriod)}>
                <Typography fontWeight={700} gutterBottom>
                  {nviPeriod.publishingYear}
                </Typography>
                <Typography>
                  {t('common.start_date')}: {startDateString}
                </Typography>
                <Typography>
                  {t('common.end_date')}: {endDateString}
                </Typography>
              </SearchListItem>
            );
          })}
        </List>
      )}

      <ErrorBoundary>
        <UpsertNviPeriodDialog
          refetchNviPeriods={nviPeriodsQuery.refetch}
          yearsWithPeriod={sortedPeriods.map(({ publishingYear }) => +publishingYear)}
          nviPeriod={nviPeriodToEdit}
          closeEditDialog={() => setNviPeriodToEdit(null)}
        />
      </ErrorBoundary>
    </Box>
  );
};
