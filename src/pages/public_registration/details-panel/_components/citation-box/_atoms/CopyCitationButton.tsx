import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface CopyCitationButtonProps {
  citation: string;
}

export const CopyCitationButton = ({ citation }: CopyCitationButtonProps) => {
  const { t } = useTranslation();

  return (
    <Button
      color="secondary"
      variant="contained"
      endIcon={<ContentCopyIcon />}
      sx={{ mt: '0.5rem', alignSelf: 'end', width: 'fit-content' }}
      onClick={() => navigator.clipboard.writeText(citation)}>
      {t('copy_citation')}
    </Button>
  );
};
