import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@material-ui/core';

import Modal from '../../../components/Modal';
import { Authority } from '../../../types/authority.types';
import AddContributorModalContent from './components/AddContributorModalContent';

interface AddContributorProps {
  onAdd: (author: Authority) => void;
}

const AddContributor: FC<AddContributorProps> = ({ onAdd }) => {
  const { t } = useTranslation('publication');

  const [addedAuthors, setAddedAuthors] = useState<Authority[]>([]);
  const [open, setOpen] = useState(false);

  const toggleModal = () => {
    setOpen(!open);
  };

  const addAuthor = (author: Authority) => {
    setAddedAuthors([...addedAuthors, author]);
    setOpen(false);
    onAdd(author);
  };

  return (
    <>
      <Button onClick={toggleModal} variant="contained" color="primary" data-testid="add-contributor">
        {t('contributors.add_author')}
      </Button>
      <Modal
        ariaDescribedBy="add-contributor-modal"
        ariaLabelledBy="add-contributor-modal"
        headingText={t('contributors.add_author')}
        onClose={toggleModal}
        openModal={open}>
        <AddContributorModalContent addAuthor={addAuthor} />
      </Modal>
    </>
  );
};

export default AddContributor;
