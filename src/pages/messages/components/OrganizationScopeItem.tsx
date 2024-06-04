import CancelIcon from '@mui/icons-material/Cancel';
import { IconButton, Paper, Skeleton, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchOrganization } from '../../../api/cristinApi';
import { dataTestId } from '../../../utils/dataTestIds';
import { getLanguageString } from '../../../utils/translation-helpers';
import { OrganizationScopeProps } from './OrganizationScope';

interface OrganizationScopeItemProps extends Pick<OrganizationScopeProps, 'setOrganizationScope'> {
  organizationScopeId: string;
  hideRemoveButton: boolean;
}

export const OrganizationScopeItem = ({
  organizationScopeId,
  setOrganizationScope,
  hideRemoveButton,
}: OrganizationScopeItemProps) => {
  const { t } = useTranslation();

  const organizationQuery = useQuery({
    enabled: !!organizationScopeId,
    queryKey: [organizationScopeId],
    queryFn: () => fetchOrganization(organizationScopeId),
    meta: { errorMessage: t('feedback.error.get_institution') },
    staleTime: Infinity,
    gcTime: 1_800_000,
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
      {organizationQuery.isPending ? (
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
          onClick={() => setOrganizationScope((state) => state.filter((id) => id !== organizationScopeId))}>
          <CancelIcon />
        </IconButton>
      )}
    </Paper>
  );
};
