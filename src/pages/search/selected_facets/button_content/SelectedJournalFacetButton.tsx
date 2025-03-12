import { Skeleton } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchSerialPublication } from '../../../../api/publicationChannelApi';

interface SelectedJournalFacetButtonProps {
  journalIdentifier: string;
}

export const SelectedJournalFacetButton = ({ journalIdentifier }: SelectedJournalFacetButtonProps) => {
  const { t } = useTranslation();

  const journalQuery = useQuery({
    queryKey: [journalIdentifier],
    queryFn: () => (journalIdentifier ? fetchSerialPublication(journalIdentifier) : undefined),
    staleTime: Infinity,
    gcTime: 1_800_000,
    meta: { errorMessage: t('feedback.error.get_journal') },
  });

  const journalName = journalQuery.data?.name || t('common.unknown');

  return journalQuery.isPending ? <Skeleton sx={{ width: '10rem', ml: '0.25rem' }} /> : journalName;
};
