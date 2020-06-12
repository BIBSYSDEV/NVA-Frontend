import React, { FC } from 'react';
import styled from 'styled-components';

import { Avatar, Backdrop, Dialog, Fade, DialogTitle, DialogProps } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import Heading from './Heading';

const StyledPaper = styled.div`
  background-color: ${({ theme }) => theme.palette.background};
  margin: 1rem;
  min-width: 35rem;
  max-width: 40rem;
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

const StyledHeading = styled(Heading)`
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
  ariaDescribedBy?: string;
  ariaLabelledBy?: string;
  children: any;
  dataTestId?: string;
  disableEscape?: boolean;
  headingIcon?: any;
  headingText?: string;
  onClose?: () => void;
  openModal: boolean;
}

const Modal: FC<ModalProps> = ({
  ariaDescribedBy,
  ariaLabelledBy,
  children,
  dataTestId,
  disableEscape,
  headingIcon,
  headingText,
  onClose,
  openModal,
  ...props
}) => {
  const handleClose = () => {
    onClose && onClose();
  };

  return (
    <Dialog
      {...props}
      aria-labelledby={ariaDescribedBy}
      aria-describedby={ariaLabelledBy}
      data-testid={dataTestId}
      disableBackdropClick={disableEscape}
      disableEscapeKeyDown={disableEscape}
      open={openModal}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}>
      <StyledHeaderContainer>
        <StyledDialogTitle disableTypography>
          {headingIcon ? (
            <StyledInfoContainer>
              {headingIcon && <StyledAvatar src={headingIcon.src} alt={headingIcon.alt} />}
              <StyledHeading>{headingText}</StyledHeading>
            </StyledInfoContainer>
          ) : (
            <StyledHeading>{headingText}</StyledHeading>
          )}
        </StyledDialogTitle>
        {!disableEscape && <StyledCloseIcon onClick={handleClose} />}
      </StyledHeaderContainer>

      <Fade in={openModal}>
        <StyledPaper>{children}</StyledPaper>
      </Fade>
    </Dialog>
  );
};

export default Modal;
