import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Modal from '../../../components/Modal';
import { Authority } from '../../../types/authority.types';
import AddContributorModalContent from './components/AddContributorModalContent';

interface AddContributorModalProps {
  onAuthorSelected: (author: Authority) => void;
  toggleModal: () => void;
  open: boolean;
  initialSearchTerm?: string;
}

const AddContributorModal: FC<AddContributorModalProps> = ({
  onAuthorSelected,
  toggleModal,
  open,
  initialSearchTerm,
}) => {
  const { t } = useTranslation('publication');
  const [addedAuthors, setAddedAuthors] = useState<Authority[]>([]);

  const addAuthor = (author: Authority) => {
    setAddedAuthors([...addedAuthors, author]);
    toggleModal();
    onAuthorSelected(author);
  };

  return (
    <Modal
      ariaDescribedBy="add-contributor-modal"
      ariaLabelledBy="add-contributor-modal"
      headingText={initialSearchTerm ? t('contributors.connect_author_identity') : t('contributors.add_author')}
      onClose={toggleModal}
      openModal={open}>
      <AddContributorModalContent addAuthor={addAuthor} initialSearchTerm={initialSearchTerm} />
    </Modal>
  );
};

export default AddContributorModal;
