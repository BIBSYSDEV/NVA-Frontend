import React, { ReactNode, useEffect } from 'react';

import { Backdrop, Button, Fade, Modal } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(2, 4, 3),
      maxWidth: '30rem',
    },
  })
);

export interface ButtonModalProps {
  ariaDescribedBy?: string;
  ariaLabelledBy?: string;
  buttonText: string;
  children: ReactNode;
  openModal?: boolean;
  startIcon?: ReactNode;
}

const ButtonModal: React.FC<ButtonModalProps> = ({
  ariaDescribedBy,
  ariaLabelledBy,
  buttonText,
  children,
  openModal,
  startIcon,
}) => {
  const [open, setOpen] = React.useState(false);
  const classes = useStyles(() => {});

  useEffect(() => {
    if (openModal) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [openModal]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button onClick={handleOpen} variant="outlined" startIcon={startIcon}>
        {buttonText}
      </Button>
      <Modal
        aria-labelledby={ariaDescribedBy}
        aria-describedby={ariaLabelledBy}
        open={open}
        onClose={handleClose}
        className={classes.modal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}>
        <Fade in={open}>
          <div className={classes.paper}>{children}</div>
        </Fade>
      </Modal>
    </>
  );
};

export default ButtonModal;
