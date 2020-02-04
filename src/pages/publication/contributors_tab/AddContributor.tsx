import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@material-ui/core';

import Modal from '../../../components/Modal';
import { Authority } from '../../../types/authority.types';
import AddContributorModal from './components/AddContributorModal';

const AddContributor: FC = () => {
  const { t } = useTranslation('publication');

  const [addedAuthors, setAddedAuthors] = useState<Authority[]>([]);
  const [open, setOpen] = useState(false);

  const toggleModal = () => {
    setOpen(!open);
  };

  const addAuthor = (author: Authority) => {
    setAddedAuthors([...addedAuthors, author]);
    setOpen(false);
  };

  return (
    <>
      {addedAuthors && addedAuthors.map(author => <h4 key={author.systemControlNumber}>{author.name}</h4>)}
      <Button onClick={toggleModal} variant="contained" color="primary" data-testid="add-contributor">
        {t('contributors.add_author')}
      </Button>
      {open && (
        <Modal
          ariaDescribedBy=""
          ariaLabelledBy=""
          headingText={t('contributors.add_author')}
          onClose={toggleModal}
          openModal={open}>
          <AddContributorModal addAuthor={addAuthor} />
        </Modal>
      )}
    </>
  );
};

export default AddContributor;
