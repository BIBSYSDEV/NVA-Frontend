import React, { ReactNode } from 'react';
import styled from 'styled-components';

import { Backdrop, Button, Dialog, Fade } from '@material-ui/core';
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

interface ButtonModalProps {
  ariaDescribedBy?: string;
  ariaLabelledBy?: string;
  buttonText?: string;
  children: (props: any) => ReactNode;
  dataTestId?: string;
  headingText?: string;
  openModal?: boolean;
  startIcon?: ReactNode;
}

const ButtonModal: React.FC<ButtonModalProps> = ({
  ariaDescribedBy,
  ariaLabelledBy,
  buttonText,
  children,
  dataTestId,
  headingText,
  openModal,
  startIcon,
}) => {
  const [open, setOpen] = React.useState(openModal ?? false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {buttonText && (
        <Button onClick={handleOpen} variant="outlined" startIcon={startIcon} data-testid={dataTestId}>
          {buttonText}
        </Button>
      )}
      <StyledDialog
        aria-labelledby={ariaDescribedBy}
        aria-describedby={ariaLabelledBy}
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
          <StyledPaper>{children({ setOpen })}</StyledPaper>
        </Fade>
      </StyledDialog>
    </>
  );
};

export default ButtonModal;
