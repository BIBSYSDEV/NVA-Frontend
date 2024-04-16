import { Chip, ChipProps, Skeleton } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchOrganization } from '../../../../api/cristinApi';
import { getLanguageString } from '../../../../utils/translation-helpers';

interface ViewingScopeChipProps extends ChipProps {
  organizationId: string;
}

export const ViewingScopeChip = ({ organizationId, ...props }: ViewingScopeChipProps) => {
  const { t } = useTranslation();

  const organizationQuery = useQuery({
    enabled: !!organizationId,
    queryKey: [organizationId],
    queryFn: organizationId ? () => fetchOrganization(organizationId) : undefined,
    meta: { errorMessage: t('feedback.error.get_institution') },
    staleTime: Infinity,
    cacheTime: 1_800_000, // 30 minutes
  });

  return (
    <Chip
      color="primary"
      {...props}
      label={
        organizationQuery.isLoading ? (
          <Skeleton sx={{ width: '15rem' }} />
        ) : organizationQuery.data?.labels ? (
          getLanguageString(organizationQuery.data.labels)
        ) : (
          t('common.unknown')
        )
      }
    />
  );
};
