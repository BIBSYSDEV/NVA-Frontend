import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Avatar, AvatarProps, Backdrop, Dialog, DialogProps, DialogTitle, Fade } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const StyledPaper = styled.div`
  background-color: ${({ theme }) => theme.palette.background};
  margin: 1rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.md + 'px'}) {
    margin-top: 0;
    min-width: auto;
  }
`;

const StyledHeaderContainer = styled.div`
  display: grid;
  padding-top: 1rem;
  grid-template-areas: 'text cross';
  grid-template-columns: auto 1fr;
  margin-bottom: 1rem;
`;

const StyledSpan = styled.span`
  grid-area: text;
  margin-left: 1rem;
`;

const StyledCloseIcon = styled(CloseIcon)`
  grid-area: cross;
  cursor: pointer;
  margin-right: 1rem;
  justify-self: end;
`;

const StyledAvatar = styled(Avatar)`
  grid-area: avatar;
  margin-left: 1rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    display: none;
    margin-left: 0;
  }
`;

const StyledInfoContainer = styled.div`
  display: grid;
  grid-template-areas: 'avatar text';
  grid-template-columns: 1fr 7fr;
  align-items: center;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    grid-template-areas: 'text text';
    grid-template-columns: 1fr;
  }
`;

const StyledDialogTitle = styled(DialogTitle)`
  grid-area: text;
  padding: 0;
`;

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
  ...props
}: ModalProps) => {
  const { t } = useTranslation('common');
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
      PaperProps={{ 'aria-labelledby': 'titleId' }}>
      <StyledHeaderContainer>
        <StyledDialogTitle>
          {headingIcon ? (
            <StyledInfoContainer>
              {headingIcon && <StyledAvatar src={headingIcon.src} alt={headingIcon.alt} />}
              <StyledSpan id="titleId" data-testid={headingDataTestId}>
                {headingText}
              </StyledSpan>
            </StyledInfoContainer>
          ) : (
            <StyledSpan id="titleId" data-testid={headingDataTestId}>
              {headingText}
            </StyledSpan>
          )}
        </StyledDialogTitle>
        <StyledCloseIcon onClick={handleClose} data-testid="close-modal" titleAccess={t('close')} />
      </StyledHeaderContainer>

      <Fade in={open}>
        <StyledPaper>{children}</StyledPaper>
      </Fade>
    </Dialog>
  );
};
