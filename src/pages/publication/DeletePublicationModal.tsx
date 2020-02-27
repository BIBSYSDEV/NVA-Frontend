import React, { FC, useState } from 'react';
import Modal from './../../components/Modal';
import { useTranslation } from 'react-i18next';
import { DialogActions, DialogContent, Button } from '@material-ui/core';
import styled from 'styled-components';
import NormalText from './../../components/NormalText';

const StyledTitleContainer = styled.div`
  font-style: italic;
`;

interface DeletePublicationModalProps {
  id: string;
  title: string;
  setDeletePublicationId: (id: string) => void;
}

const DeletePublicationModal: FC<DeletePublicationModalProps> = ({ id, title, setDeletePublicationId }) => {
  const [openModal, setOpenModal] = useState(!!id);
  const { t } = useTranslation();

  const cancelDelete = () => {
    setDeletePublicationId('');
    setOpenModal(false);
  };

  const deletePublication = () => {
    // delete publication here
    setDeletePublicationId('');
    setOpenModal(false);
  };

  return (
    <Modal openModal={openModal} headingText={t('workLists:delete_publication_heading')}>
      <DialogContent>
        <NormalText> {t('workLists:delete_publication_message')}</NormalText>
        <StyledTitleContainer>
          <NormalText>{title}</NormalText>
        </StyledTitleContainer>
      </DialogContent>
      <DialogActions>
        <Button color="primary" variant="contained" onClick={deletePublication}>
          {t('common:yes')}
        </Button>
        <Button color="secondary" variant="outlined" onClick={cancelDelete}>
          {t('common:no')}
        </Button>
      </DialogActions>
    </Modal>
  );
};

export default DeletePublicationModal;
