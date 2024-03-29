import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { Box, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { AssociatedFile } from '../../../types/associatedArtifact.types';

interface UploadedFileRowProps {
  file: AssociatedFile;
  removeFile: () => void;
}

export const UploadedFileRow = ({ file, removeFile }: UploadedFileRowProps) => {
  const { t } = useTranslation();

  return (
    <Box data-testid="uploaded-file" sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Typography sx={{ wordBreak: 'break-all', mr: '1rem' }}>{file.name}</Typography>
      <Button
        color="error"
        data-testid="button-remove-file"
        variant="outlined"
        startIcon={<RemoveCircleIcon />}
        onClick={removeFile}>
        {t('common.remove')}
      </Button>
    </Box>
  );
};
