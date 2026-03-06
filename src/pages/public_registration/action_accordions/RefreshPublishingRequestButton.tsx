import RefreshIcon from '@mui/icons-material/Refresh';
import { Button } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ActionPanelContext } from '../../../context/ActionPanelContext';
import { dataTestId } from '../../../utils/dataTestIds';
import { invalidateQueryKeyDueToReindexing } from '../../../utils/searchHelpers';

export const RefreshPublishingRequestButton = ({ ...buttonProps }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const context = useContext(ActionPanelContext);

  return (
    <Button
      {...buttonProps}
      variant="contained"
      color="tertiary"
      size="small"
      fullWidth
      onClick={async () => {
        await context.refetchData();
        invalidateQueryKeyDueToReindexing(queryClient, 'taskNotifications');
      }}
      startIcon={<RefreshIcon />}
      data-testid={dataTestId.registrationLandingPage.tasksPanel.refreshPublishingRequestButton}>
      {t('registration.public_page.tasks_panel.reload')}
    </Button>
  );
};
