import CheckIcon from '@mui/icons-material/Check';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Box, Button } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useEffect, useState } from 'react';
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
  const [justCopied, setJustCopied] = useState(false);

  useEffect(() => {
    if (!justCopied) return;
    const timer = setTimeout(() => setJustCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [justCopied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(citation);
      setJustCopied(true);
    } catch {
      dispatch(setNotification({ message: t('feedback.error.copy_citation'), variant: 'error' }));
    }
  };

  return (
    <>
      <Button
        data-testid={dataTestId.registrationLandingPage.detailsTab.copyCitationButton}
        color={justCopied ? 'success' : 'secondary'}
        variant="contained"
        endIcon={justCopied ? <CheckIcon /> : <ContentCopyIcon />}
        sx={{ mt: '0.5rem', alignSelf: 'end', width: 'fit-content' }}
        onClick={handleCopy}>
        <Box sx={{ display: 'grid', '& > *': { gridArea: '1 / 1' } }}>
          <span aria-hidden={!justCopied} style={{ visibility: justCopied ? 'visible' : 'hidden' }}>
            {t('feedback.success.copy_citation')}
          </span>
          <span aria-hidden={justCopied} style={{ visibility: justCopied ? 'hidden' : 'visible' }}>
            {t('copy_citation')}
          </span>
        </Box>
      </Button>
      <Box component="span" sx={visuallyHidden} aria-live="polite">
        {justCopied ? t('feedback.success.copy_citation') : ''}
      </Box>
    </>
  );
};
