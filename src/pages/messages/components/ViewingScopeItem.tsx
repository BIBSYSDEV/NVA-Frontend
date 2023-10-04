import CancelIcon from '@mui/icons-material/Cancel';
import { IconButton, Paper, Skeleton, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchOrganization } from '../../../api/cristinApi';
import { dataTestId } from '../../../utils/dataTestIds';
import { getLanguageString } from '../../../utils/translation-helpers';
import { ViewingScopeFilterProps } from './ViewingScopeFilter';

interface ViewingScopeItemProps extends Pick<ViewingScopeFilterProps, 'setOrganizationFilter'> {
  viewingScopeId: string;
  hideRemoveButton: boolean;
}

export const ViewingScopeItem = ({
  viewingScopeId,
  setOrganizationFilter,
  hideRemoveButton,
}: ViewingScopeItemProps) => {
  const { t } = useTranslation();

  const organizationQuery = useQuery({
    enabled: !!viewingScopeId,
    queryKey: [viewingScopeId],
    queryFn: () => fetchOrganization(viewingScopeId),
    meta: { errorMessage: t('feedback.error.get_institution') },
    staleTime: Infinity,
    cacheTime: 1_800_000,
  });

  return (
    <Paper
      sx={{
        p: '0.75rem',
        bgcolor: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '0.25rem',
      }}
      elevation={0}>
      {organizationQuery.isLoading ? (
        <Skeleton sx={{ width: '100%' }} />
      ) : (
        <Typography sx={{ fontWeight: 700 }}>{getLanguageString(organizationQuery.data?.labels)}</Typography>
      )}
      {!hideRemoveButton && (
        <IconButton
          size="small"
          color="primary"
          disabled={hideRemoveButton}
          data-testid={dataTestId.tasksPage.scope.removeOrganizationScopeButton}
          onClick={() => setOrganizationFilter((state) => state.filter((id) => id !== viewingScopeId))}>
          <CancelIcon />
        </IconButton>
      )}
    </Paper>
  );
};
