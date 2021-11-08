import { MenuItem, TextField } from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Modal } from '../../../components/Modal';
import { RootStore } from '../../../redux/reducers/rootReducer';
import { Authority } from '../../../types/authority.types';
import { ContributorRole } from '../../../types/contributor.types';
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
  const [selectedContributorRole, setSelectedContributorRole] = useState<ContributorRole | ''>(
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
          ? contributorRole === 'OtherContributor'
            ? t('contributors.create_new_with_role', { role: t('contributors.contributor').toLowerCase() })
            : t('contributors.create_new_with_role', { role: t(`contributors.types.${contributorRole}`).toLowerCase() })
          : initialSearchTerm
          ? t('contributors.verify_person')
          : t('contributors.add_as_role', {
              role:
                contributorRole === 'OtherContributor'
                  ? t('contributors.contributor').toLowerCase()
                  : t(`contributors.types.${contributorRole}`).toLowerCase(),
            })
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
            openNewContributorModal={() => setCreateNewContributor(true)}
            initialSearchTerm={initialSearchTerm}
            roleToAdd={selectedContributorRole}
          />
        ))}
    </Modal>
  );
};
