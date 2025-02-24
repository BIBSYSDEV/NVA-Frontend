import RefreshIcon from '@mui/icons-material/Refresh';
import { LoadingButton } from '@mui/lab';
import { t } from 'i18next';
import { dataTestId } from '../../../utils/dataTestIds';

interface RefreshPublishingRequestButtonProps {
  refetchData: () => void;
  isLoadingData: boolean;
}
export const RefreshPublishingRequestButton = ({ refetchData, isLoadingData }: RefreshPublishingRequestButtonProps) => {
  return (
    <LoadingButton
      variant="contained"
      color="info"
      size="small"
      loading={isLoadingData}
      fullWidth
      onClick={refetchData}
      startIcon={<RefreshIcon />}
      data-testid={dataTestId.registrationLandingPage.tasksPanel.refreshPublishingRequestButton}>
      {t('registration.public_page.tasks_panel.reload')}
    </LoadingButton>
  );
};
