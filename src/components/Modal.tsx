import React, { FC } from 'react';
import styled from 'styled-components';

import { Avatar, Backdrop, Dialog, Fade, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

const StyledPaper = styled.div`
  background-color: ${({ theme }) => theme.palette.background};
  margin: 1rem;
`;

const StyledHeaderContainer = styled.div`
  display: flex;
  padding: 1rem 0;
  justify-content: space-between;
`;

const StyledWidth = styled.div`
  min-width: 40rem;
  @media (min-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    max-width: 10rem;
  }
`;

const StyledTypography = styled(Typography)`
  font-weight: bold;
  grid-area: text;
  margin-left: 1rem;
`;

const StyledCloseIcon = styled(CloseIcon)`
  cursor: pointer;
  margin-right: 1rem;
`;

const StyledAvatar = styled(Avatar)`
  grid-area: avatar;
  margin-left: 1rem;
`;

const StyledInfoContainer = styled.div`
  display: grid;
  grid-template-areas: 'avatar text';
  grid-template-columns: 1fr 7fr;
  align-items: center;
`;

interface ModalProps {
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
}) => {
  const handleClose = () => {
    onClose && onClose();
  };

  return (
    <>
      <Dialog
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
        <StyledWidth />
        <StyledHeaderContainer>
          {headingIcon ? (
            <StyledInfoContainer>
              {headingIcon && <StyledAvatar src={headingIcon.src} alt={headingIcon.alt} />}
              <StyledTypography variant="h3">{headingText}</StyledTypography>
            </StyledInfoContainer>
          ) : (
            <StyledTypography variant="h3">{headingText}</StyledTypography>
          )}
          {!disableEscape && <StyledCloseIcon onClick={handleClose} />}
        </StyledHeaderContainer>

        <Fade in={openModal}>
          <StyledPaper>{children}</StyledPaper>
        </Fade>
      </Dialog>
    </>
  );
};

export default Modal;
