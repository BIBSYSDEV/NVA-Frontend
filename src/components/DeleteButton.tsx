import React from 'react';
import styled from 'styled-components';
import DeleteIcon from '@material-ui/icons/Delete';
import { Button } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

interface props {
  onClick: any;
}

const DeleteButton: React.FC<props> = ({ onClick }) => {
  const { t } = useTranslation('publication');

  return (
    <Button variant="contained" color="secondary" onClick={onClick}>
      <DeleteIcon />
      {t('references.remove')}
    </Button>
  );
};

export default DeleteButton;
