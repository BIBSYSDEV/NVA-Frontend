import { List, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchNviPeriods } from '../../../api/scientificIndexApi';
import { SearchListItem } from '../../../components/styled/Wrappers';

export const NviPeriodsPage = () => {
  const { t } = useTranslation();

  const nviPeriodsQuery = useQuery({
    queryKey: ['nviPeriods'],
    queryFn: fetchNviPeriods,
    meta: { errorMessage: t('feedback.error.get_nvi_periods') },
  });

  const sortedPeriods = nviPeriodsQuery.data?.periods.sort((a, b) => +b.publishingYear - +a.publishingYear) ?? [];

  return (
    <List>
      {sortedPeriods.map((nviPeriod) => (
        <SearchListItem key={nviPeriod.publishingYear} sx={{ borderLeftColor: 'nvi.main' }}>
          <Typography fontWeight={700} gutterBottom>
            {nviPeriod.publishingYear}
          </Typography>
          <Typography>
            {t('basic_data.nvi.reporting_end', { date: new Date(nviPeriod.reportingDate).toLocaleDateString() })}
          </Typography>
        </SearchListItem>
      ))}
    </List>
  );
};
