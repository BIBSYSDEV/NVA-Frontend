import React, { ReactNode, useEffect, useState } from 'react';

import { Button } from '@material-ui/core';

import Modal from './Modal';

interface ButtonModalProps {
  ariaDescribedBy?: string;
  ariaLabelledBy?: string;
  buttonText: string;
  children: any;
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
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // allows children to close Modal
  useEffect(() => {
    !openModal && setOpen(false);
  }, [openModal]);

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
