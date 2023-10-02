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
      ) : (
        <List disablePadding>
          {sortedPeriods.map((nviPeriod) => (
            <SearchListItem key={nviPeriod.publishingYear} sx={{ borderLeftColor: 'nvi.main' }}>
              <Typography fontWeight={700} gutterBottom>
                {nviPeriod.publishingYear}
              </Typography>
              <Typography>
                {t('basic_data.nvi.reporting_period', {
                  period: `${nviPeriod.startDate ? new Date(nviPeriod.startDate).toLocaleDateString() : '?'} - ${
                    nviPeriod.reportingDate ? new Date(nviPeriod.reportingDate).toLocaleDateString() : '?'
                  }`,
                })}
              </Typography>
            </SearchListItem>
          ))}
        </List>
      )}

      <UpsertNviPeriodDialog
        refetchNviPeriods={nviPeriodsQuery.refetch}
        yearsWithPeriod={sortedPeriods.map(({ publishingYear }) => +publishingYear)}
      />
    </Box>
  );
};
