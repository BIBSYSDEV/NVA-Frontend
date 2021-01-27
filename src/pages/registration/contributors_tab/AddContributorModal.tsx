import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../../../components/Modal';
import { Authority } from '../../../types/authority.types';
import AddContributorModalContent from './components/AddContributorModalContent';
import CreateContributorModalContent from './components/CreateContributorModalContent';

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
          ? t('contributors.verify_author')
          : t('contributors.add_author')
      }
      onClose={handleCloseModal}
      open={open}
      fullWidth
      maxWidth="md"
      dataTestId="contributor-modal">
      {createNewAuthor ? (
        <CreateContributorModalContent addAuthor={addAuthor} handleCloseModal={handleCloseModal} />
      ) : (
        <AddContributorModalContent
          addAuthor={addAuthor}
          handleCloseModal={handleCloseModal}
          openNewAuthorModal={() => setCreateNewAuthor(true)}
          initialSearchTerm={initialSearchTerm}
        />
      )}
    </Modal>
  );
};

export default AddContributorModal;
