import { Skeleton } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchFundingSource } from '../../../../api/cristinApi';
import { getLanguageString } from '../../../../utils/translation-helpers';

interface SelectedFundingFacetButtonProps {
  fundingIdentifier: string;
}

export const SelectedFundingFacetButton = ({ fundingIdentifier }: SelectedFundingFacetButtonProps) => {
  const { t } = useTranslation();

  const fundingSourcesQuery = useQuery({
    queryKey: ['fundingSources', fundingIdentifier],
    queryFn: () => (fundingIdentifier ? fetchFundingSource(fundingIdentifier) : undefined),
    staleTime: Infinity,
    gcTime: 1_800_000,
    meta: { errorMessage: t('feedback.error.get_funding_source') },
  });

  const fundingName = getLanguageString(fundingSourcesQuery.data?.name) || t('common.unknown');

  return <>{fundingSourcesQuery.isPending ? <Skeleton sx={{ width: '7rem', ml: '0.25rem' }} /> : fundingName}</>;
};
