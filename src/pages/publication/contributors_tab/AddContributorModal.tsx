import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../../../components/Modal';
import { Authority } from '../../../types/authority.types';
import AddContributorModalContent from './components/AddContributorModalContent';
import { Button } from '@material-ui/core';
import styled from 'styled-components';
import CreateContributorModalContent from './components/CreateContributorModalContent';

const StyledButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
`;

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
  const [createNewAuthor, setCreateNewAuthor] = useState(false);

  const addAuthor = (author: Authority) => {
    setAddedAuthors([...addedAuthors, author]);
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
      openModal={open}>
      {createNewAuthor ? (
        <CreateContributorModalContent />
      ) : (
        <>
          <AddContributorModalContent addAuthor={addAuthor} initialSearchTerm={initialSearchTerm} />
          <StyledButtonContainer>
            <Button color="primary" onClick={() => setCreateNewAuthor(true)}>
              {t('contributors.create_new_author')}
            </Button>
          </StyledButtonContainer>
        </>
      )}
    </Modal>
  );
};

export default AddContributorModal;
