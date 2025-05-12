import RefreshIcon from '@mui/icons-material/Refresh';
import { Button, ButtonProps } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { dataTestId } from '../../../utils/dataTestIds';
import { invalidateQueryKeyDueToReindexing } from '../../../utils/searchHelpers';

interface RefreshPublishingRequestButtonProps extends ButtonProps {
  refetchData: () => void;
}

export const RefreshPublishingRequestButton = ({
  refetchData,
  ...buttonProps
}: RefreshPublishingRequestButtonProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return (
    <Button
      {...buttonProps}
      variant="contained"
      color="info"
      size="small"
      fullWidth
      onClick={() => {
        refetchData();
        invalidateQueryKeyDueToReindexing(queryClient, 'taskNotifications');
      }}
      startIcon={<RefreshIcon />}
      data-testid={dataTestId.registrationLandingPage.tasksPanel.refreshPublishingRequestButton}>
      {t('registration.public_page.tasks_panel.reload')}
    </Button>
  );
};
