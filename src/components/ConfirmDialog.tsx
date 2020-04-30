import React, { FC } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import Progress from './Progress';

const StyledButtonProgressContainer = styled.div`
  margin-left: 1rem;
  display: flex;
  align-items: center;
`;

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  text: string;
  onAccept: () => void;
  onCancel: () => void;
  disableAccept?: boolean;
}

const ConfirmDialog: FC<ConfirmDialogProps> = ({ open, title, text, onAccept, onCancel, disableAccept }) => {
  const { t } = useTranslation('common');

  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{text}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} variant="contained">
          {t('common:no')}
        </Button>
        <Button onClick={onAccept} color="primary" variant="contained" disabled={disableAccept}>
          {t('common:yes')}
          {disableAccept && (
            <StyledButtonProgressContainer>
              <Progress size={15} thickness={5} />
            </StyledButtonProgressContainer>
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
