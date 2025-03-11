import { Skeleton } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchPublisher } from '../../../../api/publicationChannelApi';

interface SelectedPublisherFacetButtonProps {
  publisherIdentifier: string;
}

export const SelectedPublisherFacetButton = ({ publisherIdentifier }: SelectedPublisherFacetButtonProps) => {
  const { t } = useTranslation();

  const publisherQuery = useQuery({
    queryKey: [publisherIdentifier],
    queryFn: () => (publisherIdentifier ? fetchPublisher(publisherIdentifier) : undefined),
    staleTime: Infinity,
    gcTime: 1_800_000,
    meta: { errorMessage: t('feedback.error.get_publisher') },
  });

  const publisherName = publisherQuery.data?.name || t('common.unknown');

  return <>{publisherQuery.isPending ? <Skeleton sx={{ width: '10rem', ml: '0.25rem' }} /> : publisherName}</>;
};
