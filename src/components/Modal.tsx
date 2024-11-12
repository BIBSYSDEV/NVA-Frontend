import CloseIcon from '@mui/icons-material/Close';
import { Avatar, AvatarProps, Backdrop, Dialog, DialogProps, DialogTitle } from '@mui/material';
import { Box, styled as muiStyled } from '@mui/system';
import { useTranslation } from 'react-i18next';

const StyledSpan = muiStyled('span')({
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
    onClose && onClose();
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
      <Box sx={{ display: 'grid', pt: '1rem', gridTemplateAreas: "'text cross'", gridTemplateColumns: 'auto 1fr' }}>
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
        <CloseIcon
          onClick={handleClose}
          data-testid="close-modal"
          titleAccess={t('common.close')}
          sx={{ gridArea: 'cross', cursor: 'pointer', mr: '1rem', justifySelf: 'end' }}
        />
      </Box>

      <Box sx={{ p: '1rem' }}>{children}</Box>
    </Dialog>
  );
};
