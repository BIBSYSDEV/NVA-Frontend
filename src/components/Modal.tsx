import CloseIcon from '@mui/icons-material/Close';
import {
  Avatar,
  AvatarProps,
  Backdrop,
  Box,
  Dialog,
  DialogProps,
  DialogTitle,
  IconButton,
  styled,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { dataTestId as dataTestIdObject } from '../utils/dataTestIds';

const StyledSpan = styled('span')({
  gridArea: 'text',
  marginLeft: '1rem',
});

interface ModalProps extends Partial<DialogProps> {
  dataTestId?: string;
  headingIcon?: AvatarProps;
  headingText?: string;
  headingDataTestId?: string;
  onClose?: () => void;
}

export const Modal = ({
  children,
  dataTestId,
  headingIcon,
  headingText,
  headingDataTestId,
  onClose,
  open,
  PaperProps,
  ...props
}: ModalProps) => {
  const { t } = useTranslation();
  const handleClose = () => {
    onClose?.();
  };

  return (
    <Dialog
      {...props}
      data-testid={dataTestId}
      open={!!open}
      closeAfterTransition
      BackdropComponent={Backdrop}
      onClose={handleClose}
      BackdropProps={{
        timeout: 500,
      }}
      PaperProps={{ 'aria-labelledby': 'titleId', ...PaperProps }}>
      <Box sx={{ display: 'flex', pt: '1rem', justifyContent: 'space-between' }}>
        <DialogTitle sx={{ gridArea: 'text', padding: 0 }}>
          {headingIcon ? (
            <Box
              sx={{
                display: 'grid',
                gridTemplateAreas: { xs: "'text'", sm: "'avatar text'" },
                gridTemplateColumns: { xs: '1fr', sm: '1fr 7fr' },
                alignItems: 'center',
              }}>
              {headingIcon && (
                <Avatar
                  src={headingIcon.src}
                  alt={headingIcon.alt}
                  sx={{
                    gridArea: 'avatar',
                    ml: '1rem',
                    display: { xs: 'none', sm: 'block' },
                  }}
                />
              )}
              <StyledSpan id="titleId" data-testid={headingDataTestId}>
                {headingText}
              </StyledSpan>
            </Box>
          ) : (
            <StyledSpan id="titleId" data-testid={headingDataTestId}>
              {headingText}
            </StyledSpan>
          )}
        </DialogTitle>
        <IconButton
          title={t('common.close')}
          onClick={handleClose}
          sx={{ gridArea: 'cross', cursor: 'pointer', mr: '1rem', justifySelf: 'end' }}
          data-testid={dataTestIdObject.confirmDialog.cancelButton}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ p: '1rem' }}>{children}</Box>
    </Dialog>
  );
};
