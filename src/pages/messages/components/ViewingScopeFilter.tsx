import { Box, Paper, Skeleton, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchOrganization } from '../../../api/cristinApi';
import { getLanguageString } from '../../../utils/translation-helpers';

interface ViewingScopeFilterProps {
  viwewingScopeIds: string[];
}

export const ViewingScopeFilter = ({ viwewingScopeIds }: ViewingScopeFilterProps) => {
  return (
    <Box component="article" sx={{ m: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {viwewingScopeIds.map((viwewingScopeId) => (
        <ViewingScopeItem key={viwewingScopeId} viwewingScopeId={viwewingScopeId} />
      ))}
    </Box>
  );
};

const ViewingScopeItem = ({ viwewingScopeId }: { viwewingScopeId: string }) => {
  const { t } = useTranslation();

  const institutionQuery = useQuery({
    enabled: !!viwewingScopeId,
    queryKey: [viwewingScopeId],
    queryFn: () => fetchOrganization(viwewingScopeId),
    meta: { errorMessage: t('feedback.error.get_institution') },
    staleTime: Infinity,
    cacheTime: 1_800_000,
  });

  return (
    <Paper sx={{ p: '0.75rem', bgcolor: 'white' }} elevation={0}>
      {institutionQuery.isLoading ? (
        <Skeleton />
      ) : (
        <Typography sx={{ fontWeight: 700 }}>{getLanguageString(institutionQuery.data?.labels)}</Typography>
      )}
    </Paper>
  );
};
