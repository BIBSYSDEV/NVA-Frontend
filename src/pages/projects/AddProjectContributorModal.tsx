import { useTranslation } from 'react-i18next';
import { Modal } from '../../components/Modal';
import { AddProjectContributorForm } from './AddProjectContributorForm';
import { AddProjectManagerForm } from './AddProjectManagerForm';

interface AddProjectContributorModalProps {
  open: boolean;
  toggleModal: () => void;
  addProjectManager?: boolean;
  suggestedProjectManager?: string;
}

export const AddProjectContributorModal = ({
  open,
  toggleModal,
  suggestedProjectManager,
  addProjectManager = false,
}: AddProjectContributorModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal
      headingText={addProjectManager ? t('project.add_project_manager') : t('project.add_project_contributor')}
      open={open}
      onClose={toggleModal}
      fullWidth
      maxWidth="md"
      dataTestId="contributor-modal">
      {addProjectManager ? (
        <AddProjectManagerForm toggleModal={toggleModal} suggestedProjectManager={suggestedProjectManager} />
      ) : (
        <AddProjectContributorForm toggleModal={toggleModal} />
      )}
    </Modal>
  );
};
