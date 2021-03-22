import React, { ReactNode } from 'react';
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
  dataTestId?: string;
}

const ConfirmDialog = ({
  children,
  open,
  title,
  onAccept,
  onCancel,
  isLoading = false,
  dataTestId,
}: ConfirmDialogProps) => {
  const { t } = useTranslation('common');

  return (
    <Dialog open={open} onClose={onCancel} data-testid={dataTestId} PaperProps={{ 'aria-labelledby': 'titleId' }}>
      <DialogTitle id="titleId">{title}</DialogTitle>
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
