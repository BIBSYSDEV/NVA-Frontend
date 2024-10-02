import { useTranslation } from 'react-i18next';
import { Modal } from '../../components/Modal';
import { AddProjectContributorForm } from './AddProjectContributorForm';
import { AddProjectManagerForm } from './AddProjectManagerForm';

interface AddProjectContributorModalProps {
  open: boolean;
  toggleModal: () => void;
  addProjectManager?: boolean;
  suggestedProjectManager?: string;
  initialSearchTerm?: string;
  indexToReplace?: number;
}

export const AddProjectContributorModal = ({
  open,
  toggleModal,
  suggestedProjectManager = '',
  addProjectManager = false,
  initialSearchTerm = '',
  indexToReplace = -1,
}: AddProjectContributorModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal
      headingText={addProjectManager ? t('project.add_project_manager') : t('project.add_member')}
      open={open}
      onClose={toggleModal}
      fullWidth
      maxWidth="md"
      dataTestId="contributor-modal">
      {addProjectManager ? (
        <AddProjectManagerForm
          toggleModal={toggleModal}
          suggestedProjectManager={suggestedProjectManager}
          initialSearchTerm={initialSearchTerm}
          indexToReplace={indexToReplace}
        />
      ) : (
        <AddProjectContributorForm
          toggleModal={toggleModal}
          initialSearchTerm={initialSearchTerm}
          indexToReplace={indexToReplace}
        />
      )}
    </Modal>
  );
};
