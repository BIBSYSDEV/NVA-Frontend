import RefreshIcon from '@mui/icons-material/Refresh';
import { dataTestId } from '../../../utils/dataTestIds';
import { useTranslation } from 'react-i18next';
import { Button, ButtonProps } from '@mui/material';

interface RefreshPublishingRequestButtonProps extends ButtonProps {
  refetchData: () => void;
}

export const RefreshPublishingRequestButton = ({
  refetchData,
  ...buttonProps
}: RefreshPublishingRequestButtonProps) => {
  const { t } = useTranslation();

  return (
    <Button
      {...buttonProps}
      variant="contained"
      color="info"
      size="small"
      fullWidth
      onClick={refetchData}
      startIcon={<RefreshIcon />}
      data-testid={dataTestId.registrationLandingPage.tasksPanel.refreshPublishingRequestButton}>
      {t('registration.public_page.tasks_panel.reload')}
    </Button>
  );
};
