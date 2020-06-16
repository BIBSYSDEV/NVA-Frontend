import React, { FC } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import ButtonWithProgress from './ButtonWithProgress';
import styled from 'styled-components';

const StyledDialogContentText = styled(DialogContentText)`
  min-width: 35rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.md + 'px'}) {
    min-width: auto;
  }
`;

interface ConfirmDialogProps {
  children: any;
  open: boolean;
  title: string;
  onAccept: () => void;
  onCancel: () => void;
  disableAccept?: boolean;
}

const ConfirmDialog: FC<ConfirmDialogProps> = ({
  children,
  open,
  title,
  onAccept,
  onCancel,
  disableAccept = false,
}) => {
  const { t } = useTranslation('common');

  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <StyledDialogContentText>{children}</StyledDialogContentText>
      </DialogContent>
      <DialogActions>
        <Button data-testid="cancel-button" variant="contained" onClick={onCancel}>
          {t('common:no')}
        </Button>
        <ButtonWithProgress data-testid="accept-button" isLoading={disableAccept} onClick={onAccept}>
          {t('common:yes')}
        </ButtonWithProgress>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
