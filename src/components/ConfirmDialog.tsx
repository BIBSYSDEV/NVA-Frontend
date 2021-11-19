import React, { ReactNode } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

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

export const ConfirmDialog = ({
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
        <LoadingButton
          data-testid="accept-button"
          color="secondary"
          variant="contained"
          loading={isLoading}
          onClick={onAccept}>
          {t('common:yes')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
