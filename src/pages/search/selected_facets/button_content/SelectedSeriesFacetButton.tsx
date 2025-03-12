import { Skeleton } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchSerialPublication } from '../../../../api/publicationChannelApi';

interface SelectedSeriesFacetButtonProps {
  seriesIdentifier: string;
}

export const SelectedSeriesFacetButton = ({ seriesIdentifier }: SelectedSeriesFacetButtonProps) => {
  const { t } = useTranslation();

  const seriesQuery = useQuery({
    queryKey: [seriesIdentifier],
    queryFn: () => (seriesIdentifier ? fetchSerialPublication(seriesIdentifier) : undefined),
    staleTime: Infinity,
    gcTime: 1_800_000,
    meta: { errorMessage: t('feedback.error.get_series') },
  });

  const seriesName = seriesQuery.data?.name || t('common.unknown');

  return seriesQuery.isPending ? <Skeleton sx={{ width: '10rem', ml: '0.25rem' }} /> : seriesName;
};
