import { MenuItem, TextField } from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Modal } from '../../../components/Modal';
import { RootStore } from '../../../redux/reducers/rootReducer';
import { Authority } from '../../../types/authority.types';
import { ContributorRole } from '../../../types/contributor.types';
import { getAddContributorText, getCreateContributorText } from '../../../utils/translation-helpers';
import { AddContributorModalContent } from './components/AddContributorModalContent';
import { CreateContributorModalContent } from './components/CreateContributorModalContent';

const StyledTextField = styled(TextField)`
  max-width: 15rem;
`;

interface AddContributorModalProps {
  onContributorSelected: (authority: Authority, role: ContributorRole) => void;
  open: boolean;
  toggleModal: () => void;
  contributorRoles: ContributorRole[];
  contributorRole: string;
  initialSearchTerm?: string;
}

export const AddContributorModal = ({
  onContributorSelected,
  toggleModal,
  open,
  contributorRoles,
  contributorRole,
  initialSearchTerm,
}: AddContributorModalProps) => {
  const { t } = useTranslation('registration');
  const [createNewContributor, setCreateNewContributor] = useState(false);
  const user = useSelector((store: RootStore) => store.user);
  const [selectedContributorRole, setSelectedContributorRole] = useState(
    contributorRoles.length === 1 ? contributorRoles[0] : ''
  );

  const addContributor = (authority: Authority) => {
    onContributorSelected(authority, selectedContributorRole as ContributorRole);
    handleCloseModal();
  };

  const addSelfAsContributor = () => {
    if (user?.authority) {
      onContributorSelected(user.authority, selectedContributorRole as ContributorRole);
    }
    handleCloseModal();
  };

  const handleCloseModal = () => {
    toggleModal();
    if (contributorRoles.length > 1) {
      setSelectedContributorRole('');
    }
    setCreateNewContributor(false);
  };

  return (
    <Modal
      headingText={
        createNewContributor
          ? getCreateContributorText(contributorRole)
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
        (createNewContributor ? (
          <CreateContributorModalContent addContributor={addContributor} handleCloseModal={handleCloseModal} />
        ) : (
          <AddContributorModalContent
            addContributor={addContributor}
            addSelfAsContributor={addSelfAsContributor}
            contributorRole={contributorRole}
            handleCloseModal={handleCloseModal}
            openNewContributorModal={() => setCreateNewContributor(true)}
            initialSearchTerm={initialSearchTerm}
          />
        ))}
    </Modal>
  );
};
