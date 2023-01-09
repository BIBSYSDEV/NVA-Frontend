import { MenuItem, TextField } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '../../../components/Modal';
import { Contributor, ContributorRole } from '../../../types/contributor.types';
import { AddContributorForm } from './components/AddContributorForm';
import { AddUnverifiedContributorForm } from './components/AddUnverifiedContributorForm';
import { dataTestId } from '../../../utils/dataTestIds';
import { CristinPerson } from '../../../types/user.types';

interface AddContributorModalProps {
  onContributorSelected: (newContributor: CristinPerson, role: ContributorRole) => void;
  addUnverifiedContributor?: (contributor: Contributor) => void;
  open: boolean;
  toggleModal: () => void;
  contributorRoles: ContributorRole[];
  initialSearchTerm?: string;
}

export const AddContributorModal = ({
  onContributorSelected,
  addUnverifiedContributor,
  toggleModal,
  open,
  contributorRoles,
  initialSearchTerm,
}: AddContributorModalProps) => {
  const { t } = useTranslation();
  const [openAddUnverifiedContributor, setOpenAddUnverifiedContributor] = useState(false);
  const [selectedContributorRole, setSelectedContributorRole] = useState(contributorRoles[0]);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm ?? '');

  const addContributor = (newContributor: CristinPerson) => {
    onContributorSelected(newContributor, selectedContributorRole as ContributorRole);
    handleCloseModal();
  };

  const handleCloseModal = () => {
    toggleModal();
    setOpenAddUnverifiedContributor(false);
    setSearchTerm('');
  };

  return (
    <Modal
      headingText={
        initialSearchTerm
          ? t('registration.contributors.verify_person')
          : t('registration.contributors.add_contributor')
      }
      onClose={handleCloseModal}
      open={open}
      fullWidth
      maxWidth="md"
      dataTestId="contributor-modal">
      {contributorRoles.length > 1 && (
        <TextField
          data-testid={dataTestId.registrationWizard.contributors.selectContributorType}
          sx={{ maxWidth: '15rem' }}
          value={selectedContributorRole}
          onChange={(event) => {
            const role = (event.target.value as ContributorRole) ?? '';
            setSelectedContributorRole(role);
          }}
          fullWidth
          select
          label={t('registration.contributors.select_contributor_type')}
          variant="outlined">
          {contributorRoles.map((role) => (
            <MenuItem key={role} value={role}>
              {t(`registration.contributors.types.${role}`)}
            </MenuItem>
          ))}
        </TextField>
      )}
      {selectedContributorRole &&
        (openAddUnverifiedContributor && !initialSearchTerm ? (
          <AddUnverifiedContributorForm
            searchTerm={searchTerm}
            addUnverifiedContributor={(newContributor) => {
              newContributor.role = selectedContributorRole;
              addUnverifiedContributor?.(newContributor);
            }}
            handleCloseModal={handleCloseModal}
            handleCancel={() => setOpenAddUnverifiedContributor(false)}
          />
        ) : (
          <AddContributorForm
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            addContributor={addContributor}
            openAddUnverifiedContributor={() => setOpenAddUnverifiedContributor(true)}
            initialSearchTerm={initialSearchTerm}
            roleToAdd={selectedContributorRole}
          />
        ))}
    </Modal>
  );
};
