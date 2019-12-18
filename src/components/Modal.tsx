import React, { useEffect } from 'react';
import styled from 'styled-components';

import { Backdrop, Dialog, Fade } from '@material-ui/core';
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
  margin: 1rem 1rem 0 1rem;
  justify-content: space-between;
`;

const StyledHeading = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
`;

const StyledCloseIcon = styled(CloseIcon)`
  cursor: pointer;
`;

interface ModalProps {
  ariaDescribedBy?: string;
  ariaLabelledBy?: string;
  children: any;
  dataTestId?: string;
  headingText?: string;
  onClose?: () => void;
  openModal: boolean;
}

const Modal: React.FC<ModalProps> = ({
  ariaDescribedBy,
  ariaLabelledBy,
  children,
  dataTestId,
  headingText,
  onClose,
  openModal,
}) => {
  const [open, setOpen] = React.useState(openModal ?? false);

  // allows ButtonModal to close Modal
  const handleClose = () => {
    onClose && onClose();
    setOpen(false);
  };

  // allows children of Modal and ButtonModal to open and close Modal
  useEffect(() => {
    openModal && setOpen(true);
    !openModal && setOpen(false);
  }, [openModal]);

  return (
    <>
      <StyledDialog
        aria-labelledby={ariaDescribedBy}
        aria-describedby={ariaLabelledBy}
        data-testid={dataTestId}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}>
        <StyledHeaderContainer>
          <StyledHeading>{headingText}</StyledHeading>
          <StyledCloseIcon onClick={handleClose} />
        </StyledHeaderContainer>

        <Fade in={open}>
          <StyledPaper>{children}</StyledPaper>
        </Fade>
      </StyledDialog>
    </>
  );
};

export default Modal;
