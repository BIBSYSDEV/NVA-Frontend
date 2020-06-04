import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../../../components/Modal';
import { Authority } from '../../../types/authority.types';
import AddContributorModalContent from './components/AddContributorModalContent';
import { Button } from '@material-ui/core';
import CreateContributorModalContent from './components/CreateContributorModalContent';
import { RightAlignedButtonWrapper } from '../../../components/styled/Wrappers';

interface AddContributorModalProps {
  onAuthorSelected: (author: Authority) => void;
  open: boolean;
  toggleModal: () => void;
  initialSearchTerm?: string;
}

const AddContributorModal: FC<AddContributorModalProps> = ({
  onAuthorSelected,
  toggleModal,
  open,
  initialSearchTerm,
}) => {
  const { t } = useTranslation('publication');
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
      ariaDescribedBy="add-contributor-modal"
      ariaLabelledBy="add-contributor-modal"
      headingText={
        createNewAuthor
          ? t('contributors.create_new_author')
          : initialSearchTerm
          ? t('contributors.connect_author_identity')
          : t('contributors.add_author')
      }
      onClose={handleCloseModal}
      openModal={open}
      maxWidth="lg">
      {createNewAuthor ? (
        <CreateContributorModalContent addAuthor={addAuthor} handleCloseModal={handleCloseModal} />
      ) : (
        <>
          <AddContributorModalContent addAuthor={addAuthor} initialSearchTerm={initialSearchTerm} />
          <RightAlignedButtonWrapper>
            <Button color="primary" onClick={() => setCreateNewAuthor(true)}>
              {t('contributors.create_new_author')}
            </Button>
          </RightAlignedButtonWrapper>
        </>
      )}
    </Modal>
  );
};

export default AddContributorModal;
