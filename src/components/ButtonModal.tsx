import React, { ReactNode } from 'react';
import styled from 'styled-components';

import { Backdrop, Button, Dialog, Fade } from '@material-ui/core';

const StyledDialog = styled(Dialog)`
  display: 'flex';
  align-items: 'center';
  justify-content: 'center';
`;

const StyledPaper = styled.div`
  background-color: ${({ theme }) => theme.palette.background};
  padding: ${({ theme }) => theme.spacing(2, 4, 3)};
  width: '50rem';
`;

interface ButtonModalProps {
  ariaDescribedBy?: string;
  ariaLabelledBy?: string;
  buttonText: string;
  children: (props: any) => ReactNode;
  dataTestId?: string;
  startIcon?: ReactNode;
}

const ButtonModal: React.FC<ButtonModalProps> = ({
  ariaDescribedBy,
  ariaLabelledBy,
  buttonText,
  children,
  dataTestId,
  startIcon,
}) => {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button onClick={handleOpen} variant="outlined" startIcon={startIcon} data-testid={dataTestId}>
        {buttonText}
      </Button>
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
        <Fade in={open}>
          <StyledPaper>{children({ setOpen })}</StyledPaper>
        </Fade>
      </StyledDialog>
    </>
  );
};

export default ButtonModal;
