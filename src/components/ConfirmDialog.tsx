import React, { FC, ReactNode } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import ButtonWithProgress from './ButtonWithProgress';

const StyledDialogContentText = styled.div`
  min-width: 35rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.md + 'px'}) {
    min-width: auto;
  }
`;

interface ConfirmDialogProps {
  children: ReactNode;
  open: boolean;
  title: string;
  onAccept: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const ConfirmDialog: FC<ConfirmDialogProps> = ({ children, open, title, onAccept, onCancel, isLoading = false }) => {
  const { t } = useTranslation('common');

  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <StyledDialogContentText>{children}</StyledDialogContentText>
      </DialogContent>
      <DialogActions>
        <Button data-testid="cancel-button" color="primary" variant="outlined" onClick={onCancel}>
          {t('common:no')}
        </Button>
        <ButtonWithProgress data-testid="accept-button" color="secondary" isLoading={isLoading} onClick={onAccept}>
          {t('common:yes')}
        </ButtonWithProgress>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
