import CloseIcon from '@mui/icons-material/Close';
import { Box, Dialog, DialogProps, DialogTitle, IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { dialogDescriptionId } from '../themes/mainTheme';
import { dataTestId as dataTestIdObject } from '../utils/dataTestIds';

interface ModalProps extends Partial<DialogProps> {
  dataTestId?: string;
  headingText?: string;
  onClose?: () => void;
}

export const Modal = ({ children, dataTestId, headingText, onClose, open, ...props }: ModalProps) => {
  const { t } = useTranslation();
  const handleClose = () => {
    onClose?.();
  };

  return (
    <Dialog {...props} data-testid={dataTestId} open={!!open} onClose={handleClose}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: '1rem', mx: '1rem' }}>
        <DialogTitle sx={{ padding: 0 }}>{headingText}</DialogTitle>
        <IconButton
          title={t('common.close')}
          onClick={handleClose}
          data-testid={dataTestIdObject.confirmDialog.cancelButton}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box id={dialogDescriptionId} sx={{ m: '1rem' }}>
        {children}
      </Box>
    </Dialog>
  );
};
