import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Modal from '../../../components/Modal';
import { Authority } from '../../../types/authority.types';
import AddContributorModalContent from './components/AddContributorModalContent';
import { Button } from '@material-ui/core';
import { Formik, Form, Field } from 'formik';
import { emptyNewContributor } from '../../../types/contributor.types';
import { TextField } from 'formik-material-ui';

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

  const handleClickNewAuthor = () => {
    setCreateNewAuthor(true);
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
        <Formik
          initialValues={emptyNewContributor}
          onSubmit={(values) => console.log('create new author here', values)}>
          <Form>
            <p>
              Personregisteret inneholder personer med opphavsrett til publiserte vitenskapelige arbeid som er
              tilgjengelig i institusjonens bibliotek, vitenarkiv eller er del av Norsk Vitenskapsindeks. Også omtalte
              personer kan bli registrert.
            </p>
            <Field
              aria-label="firstName"
              name="firstName"
              label={t('common:first_name')}
              component={TextField}
              fullWidth
              variant="outlined"
              inputProps={{ 'data-testid': 'publication-title-input' }}
            />
            <Field
              aria-label="lastName"
              name="lastName"
              label={t('common:last_name')}
              component={TextField}
              fullWidth
              variant="outlined"
              inputProps={{ 'data-testid': 'publication-title-input' }}
            />
            <Field
              aria-label="messageToCurator"
              name="messageToCurator"
              label={t('common:message_to_curator')}
              component={TextField}
              multiline
              rows="4"
              fullWidth
              variant="outlined"
              inputProps={{ 'data-testid': 'message_to_curator' }}
            />
            <Button type="submit" color="primary" variant="contained">
              Opprett
            </Button>
          </Form>
        </Formik>
      ) : (
        <>
          <AddContributorModalContent addAuthor={addAuthor} initialSearchTerm={initialSearchTerm} />
          <Button onClick={handleClickNewAuthor}>Opprett ny forfatter</Button>
        </>
      )}
    </Modal>
  );
};

export default AddContributorModal;
