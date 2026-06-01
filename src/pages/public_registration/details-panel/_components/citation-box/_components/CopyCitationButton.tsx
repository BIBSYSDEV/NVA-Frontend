import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setNotification } from '../../../../../../redux/notificationSlice';
import { dataTestId } from '../../../../../../utils/dataTestIds';

interface CopyCitationButtonProps {
  citation: string;
}

export const CopyCitationButton = ({ citation }: CopyCitationButtonProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(citation);
      dispatch(setNotification({ message: t('feedback.success.copy_citation'), variant: 'success' }));
    } catch {
      dispatch(setNotification({ message: t('feedback.error.copy_citation'), variant: 'error' }));
    }
  };

  return (
    <Button
      data-testid={dataTestId.registrationLandingPage.detailsTab.copyCitationButton}
      color="secondary"
      variant="contained"
      endIcon={<ContentCopyIcon />}
      sx={{ mt: '0.5rem', alignSelf: 'end', width: 'fit-content' }}
      onClick={handleCopy}>
      {t('copy_citation')}
    </Button>
  );
};
