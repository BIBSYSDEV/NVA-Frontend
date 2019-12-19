import React, { ReactNode, useState } from 'react';

import { Button } from '@material-ui/core';

import Modal from './Modal';

interface ButtonModalProps {
  ariaDescribedBy?: string;
  ariaLabelledBy?: string;
  buttonText: string;
  children: any;
  dataTestId?: string;
  headingText?: string;
  startIcon?: ReactNode;
}

const ButtonModal: React.FC<ButtonModalProps> = ({
  ariaDescribedBy,
  ariaLabelledBy,
  buttonText,
  children,
  dataTestId,
  headingText,
  startIcon,
}) => {
  const [open, setOpen] = useState(false);

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
      <Modal
        ariaDescribedBy={ariaDescribedBy}
        ariaLabelledBy={ariaLabelledBy}
        headingText={headingText}
        onClose={handleClose}
        openModal={open}>
        {children}
      </Modal>
    </>
  );
};

export default ButtonModal;
