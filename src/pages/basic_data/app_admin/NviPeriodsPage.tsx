import { Box, List, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchNviPeriods } from '../../../api/scientificIndexApi';
import { ListSkeleton } from '../../../components/ListSkeleton';
import { SearchListItem } from '../../../components/styled/Wrappers';
import { UpsertNviPeriodDialog } from './UpsertNviPeriodDialog';

export const NviPeriodsPage = () => {
  const { t } = useTranslation();

  const nviPeriodsQuery = useQuery({
    queryKey: ['nviPeriods'],
    queryFn: fetchNviPeriods,
    meta: { errorMessage: t('feedback.error.get_nvi_periods') },
  });

  const sortedPeriods = nviPeriodsQuery.data?.periods.sort((a, b) => +b.publishingYear - +a.publishingYear) ?? [];

  return (
    <Box component="section">
      {nviPeriodsQuery.isLoading ? (
        <ListSkeleton height={100} minWidth={100} />
      ) : sortedPeriods.length === 0 ? (
        <Typography>{t('common.no_hits')}</Typography>
      ) : (
        <List disablePadding>
          {sortedPeriods.map((nviPeriod) => {
            const startDateString = nviPeriod.startDate
              ? `${new Date(nviPeriod.startDate).toLocaleDateString()} (${new Date(
                  nviPeriod.startDate
                ).toLocaleTimeString()})`
              : '?';
            const endDateString = nviPeriod.reportingDate
              ? `${new Date(nviPeriod.reportingDate).toLocaleDateString()} (${new Date(
                  nviPeriod.reportingDate
                ).toLocaleTimeString()})`
              : '?';

            return (
              <SearchListItem key={nviPeriod.publishingYear} sx={{ borderLeftColor: 'nvi.main' }}>
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

      <UpsertNviPeriodDialog
        refetchNviPeriods={nviPeriodsQuery.refetch}
        yearsWithPeriod={sortedPeriods.map(({ publishingYear }) => +publishingYear)}
      />
    </Box>
  );
};
