import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../../../components/Modal';
import { Authority } from '../../../types/authority.types';
import AddContributorModalContent from './components/AddContributorModalContent';
import { Button } from '@material-ui/core';
import CreateContributorModalContent from './components/CreateContributorModalContent';
import { StyledRightAlignedWrapper } from '../../../components/styled/Wrappers';

interface AddContributorModalProps {
  onAuthorSelected: (author: Authority) => void;
  open: boolean;
  toggleModal: () => void;
  initialSearchTerm?: string;
}

const AddContributorModal = ({ onAuthorSelected, toggleModal, open, initialSearchTerm }: AddContributorModalProps) => {
  const { t } = useTranslation('registration');
  const [createNewAuthor, setCreateNewAuthor] = useState(false);

  const addAuthor = (author: Authority) => {
    toggleModal();
    onAuthorSelected(author);
  };

  const handleCloseModal = () => {
    toggleModal();
    setCreateNewAuthor(false);
  };

  return (
    <Modal
      aria-describedby="add-contributor-modal"
      aria-labelledby="add-contributor-modal"
      headingText={
        createNewAuthor
          ? t('contributors.create_new_author')
          : initialSearchTerm
          ? t('contributors.connect_author_identity')
          : t('contributors.add_author')
      }
      onClose={handleCloseModal}
      open={open}
      fullWidth
      maxWidth="md">
      {createNewAuthor ? (
        <CreateContributorModalContent addAuthor={addAuthor} handleCloseModal={handleCloseModal} />
      ) : (
        <>
          <AddContributorModalContent addAuthor={addAuthor} initialSearchTerm={initialSearchTerm} />
          <StyledRightAlignedWrapper>
            <Button onClick={handleCloseModal}>{t('common:close')}</Button>
            <Button color="primary" data-testid="button-create-new-author" onClick={() => setCreateNewAuthor(true)}>
              {t('contributors.create_new_author')}
            </Button>
          </StyledRightAlignedWrapper>
        </>
      )}
    </Modal>
  );
};

export default AddContributorModal;
