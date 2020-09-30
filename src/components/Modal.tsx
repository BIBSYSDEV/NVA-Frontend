import React, { FC } from 'react';
import styled from 'styled-components';
import { Avatar, Backdrop, Dialog, Fade, DialogTitle, DialogProps, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

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

const StyledHeading = styled(Typography)`
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
  headingIcon?: any;
  headingText?: string;
  onClose?: () => void;
}

const Modal: FC<ModalProps> = ({ children, dataTestId, headingIcon, headingText, onClose, open, ...props }) => {
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
      }}>
      <StyledHeaderContainer>
        <StyledDialogTitle disableTypography>
          {headingIcon ? (
            <StyledInfoContainer>
              {headingIcon && <StyledAvatar src={headingIcon.src} alt={headingIcon.alt} />}
              <StyledHeading variant="h3">{headingText}</StyledHeading>
            </StyledInfoContainer>
          ) : (
            <StyledHeading variant="h3">{headingText}</StyledHeading>
          )}
        </StyledDialogTitle>
        <StyledCloseIcon onClick={handleClose} />
      </StyledHeaderContainer>

      <Fade in={open}>
        <StyledPaper>{children}</StyledPaper>
      </Fade>
    </Dialog>
  );
};

export default Modal;
