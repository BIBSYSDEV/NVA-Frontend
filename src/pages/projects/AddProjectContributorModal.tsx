import { useTranslation } from 'react-i18next';
import { Modal } from '../../components/Modal';
import { AddProjectContributorForm } from './AddProjectContributorForm';

interface AddProjectContributorModalProps {
  open: boolean;
  hasProjectManager: boolean;
  toggleModal: () => void;
}

export const AddProjectContributorModal = ({
  open,
  hasProjectManager,
  toggleModal,
}: AddProjectContributorModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal
      headingText={t('project.add_project_contributor')}
      open={open}
      onClose={toggleModal}
      fullWidth
      maxWidth="md"
      dataTestId="contributor-modal">
      <AddProjectContributorForm hasProjectManager={hasProjectManager} toggleModal={toggleModal} />
    </Modal>
  );
};
