import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Modal from '../../../components/Modal';
import { RootStore } from '../../../redux/reducers/rootReducer';
import { Authority } from '../../../types/authority.types';
import { ContributorRole } from '../../../types/contributor.types';
import { getAddContributorText } from '../../../utils/validation/registration/contributorTranslations';
import { AddContributorModalContent } from './components/AddContributorModalContent';
import { CreateContributorModalContent } from './components/CreateContributorModalContent';

interface AddContributorModalProps {
  onAuthorSelected: (author: Authority) => void;
  open: boolean;
  toggleModal: () => void;
  contributorRole?: ContributorRole;
  initialSearchTerm?: string;
}

const AddContributorModal = ({
  onAuthorSelected,
  toggleModal,
  open,
  contributorRole = ContributorRole.CREATOR,
  initialSearchTerm,
}: AddContributorModalProps) => {
  const { t } = useTranslation('registration');
  const [createNewAuthor, setCreateNewAuthor] = useState(false);
  const user = useSelector((store: RootStore) => store.user);

  const addAuthor = (author: Authority) => {
    toggleModal();
    onAuthorSelected(author);
  };

  const addSelfAsAuthor = () => {
    toggleModal();
    if (user?.authority) {
      onAuthorSelected(user.authority);
    }
  };

  const handleCloseModal = () => {
    toggleModal();
    setCreateNewAuthor(false);
  };

  return (
    <Modal
      headingText={
        createNewAuthor
          ? t('contributors.create_new_author')
          : initialSearchTerm
          ? t('contributors.verify_person')
          : getAddContributorText(contributorRole)
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
          addSelfAsAuthor={addSelfAsAuthor}
          contributorRole={contributorRole}
          handleCloseModal={handleCloseModal}
          openNewAuthorModal={() => setCreateNewAuthor(true)}
          initialSearchTerm={initialSearchTerm}
        />
      )}
    </Modal>
  );
};

export default AddContributorModal;
