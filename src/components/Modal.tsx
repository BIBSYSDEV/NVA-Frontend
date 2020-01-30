import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';

import { Avatar, Backdrop, Dialog, Fade } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

const StyledDialog = styled(Dialog)`
  display: 'flex';
  align-items: 'center';
  justify-content: 'center';
`;

const StyledPaper = styled.div`
  background-color: ${({ theme }) => theme.palette.background};
  margin: 1rem;
  width: '50rem';
`;

const StyledHeaderContainer = styled.div`
  display: flex;
  padding: 1rem 0;
  justify-content: space-between;
`;

const StyledHeading = styled.div`
  font-size: 1.2rem;
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
  openModal?: boolean;
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
  const [open, setOpen] = useState(openModal ?? true);

  // allows ButtonModal to close Modal
  const handleClose = () => {
    onClose && onClose();
    setOpen(false);
  };

  // allows children of Modal and ButtonModal to open and close Modal
  useEffect(() => {
    openModal && setOpen(openModal);
  }, [openModal]);

  return (
    <>
      <StyledDialog
        aria-labelledby={ariaDescribedBy}
        aria-describedby={ariaLabelledBy}
        data-testid={dataTestId}
        disableBackdropClick={disableEscape}
        disableEscapeKeyDown={disableEscape}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}>
        <StyledHeaderContainer>
          {headingIcon ? (
            <StyledInfoContainer>
              {headingIcon && <StyledAvatar src={headingIcon.src} alt={headingIcon.alt} />}
              <StyledHeading>{headingText}</StyledHeading>
            </StyledInfoContainer>
          ) : (
            <StyledHeading>{headingText}</StyledHeading>
          )}
          {!disableEscape && <StyledCloseIcon onClick={handleClose} />}
        </StyledHeaderContainer>

        <Fade in={open}>
          <StyledPaper>{children}</StyledPaper>
        </Fade>
      </StyledDialog>
    </>
  );
};

export default Modal;
