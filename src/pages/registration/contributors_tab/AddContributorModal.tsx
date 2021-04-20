import { MenuItem, TextField } from '@material-ui/core';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import Modal from '../../../components/Modal';
import { RootStore } from '../../../redux/reducers/rootReducer';
import { Authority } from '../../../types/authority.types';
import { ContributorRole } from '../../../types/contributor.types';
import { getAddContributorText } from '../../../utils/validation/registration/contributorTranslations';
import { AddContributorModalContent } from './components/AddContributorModalContent';
import { CreateContributorModalContent } from './components/CreateContributorModalContent';

const StyledTextField = styled(TextField)`
  max-width: 15rem;
`;

interface AddContributorModalProps {
  onAuthorSelected: (author: Authority, role: ContributorRole) => void;
  open: boolean;
  toggleModal: () => void;
  contributorRoles: ContributorRole[];
  initialSearchTerm?: string;
}

const AddContributorModal = ({
  onAuthorSelected,
  toggleModal,
  open,
  contributorRoles,
  initialSearchTerm,
}: AddContributorModalProps) => {
  const { t } = useTranslation('registration');
  const [createNewAuthor, setCreateNewAuthor] = useState(false);
  const user = useSelector((store: RootStore) => store.user);
  const [selectedContributorRole, setSelectedContributorRole] = useState(
    contributorRoles.length === 1 ? contributorRoles[0] : ''
  );

  const addAuthor = (author: Authority) => {
    onAuthorSelected(author, selectedContributorRole as ContributorRole);
    handleCloseModal();
  };

  const addSelfAsAuthor = () => {
    if (user?.authority) {
      onAuthorSelected(user.authority, selectedContributorRole as ContributorRole);
    }
    handleCloseModal();
  };

  const handleCloseModal = () => {
    toggleModal();
    if (contributorRoles.length > 1) {
      setSelectedContributorRole('');
    }
    setCreateNewAuthor(false);
  };
  const contributorRole = contributorRoles.length === 1 ? contributorRoles[0] : 'Contributor';

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
      {contributorRoles.length > 1 && (
        <StyledTextField
          value={selectedContributorRole}
          onChange={(event) => {
            const role = (event.target.value as ContributorRole) ?? '';
            setSelectedContributorRole(role);
          }}
          fullWidth
          select
          label={t('contributors.select_contributor_type')}
          variant="outlined">
          {contributorRoles.map((role) => (
            <MenuItem key={role} value={role}>
              {t(`contributors.types.${role}`)}
            </MenuItem>
          ))}
        </StyledTextField>
      )}
      {selectedContributorRole &&
        (createNewAuthor ? (
          <CreateContributorModalContent addAuthor={addAuthor} handleCloseModal={handleCloseModal} />
        ) : (
          <AddContributorModalContent
            addAuthor={addAuthor}
            addSelfAsAuthor={addSelfAsAuthor}
            contributorRoles={contributorRoles}
            handleCloseModal={handleCloseModal}
            openNewAuthorModal={() => setCreateNewAuthor(true)}
            initialSearchTerm={initialSearchTerm}
          />
        ))}
    </Modal>
  );
};

export default AddContributorModal;
