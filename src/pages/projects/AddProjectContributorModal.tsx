import { useTranslation } from 'react-i18next';
import { Modal } from '../../components/Modal';
import { ProjectContributorType } from '../../types/project.types';
import { AddProjectContributorForm } from './AddProjectContributorForm';
import { AddProjectManagerForm } from './AddProjectManagerForm';

interface AddProjectContributorModalProps {
  open: boolean;
  toggleModal: () => void;
  roleType: ProjectContributorType;
  suggestedProjectManager?: string;
  initialSearchTerm?: string;
  indexToReplace?: number;
}

export const AddProjectContributorModal = ({
  open,
  toggleModal,
  roleType,
  suggestedProjectManager = '',
  initialSearchTerm = '',
  indexToReplace = -1,
}: AddProjectContributorModalProps) => {
  const { t } = useTranslation();
  const addProjectManager = roleType === 'ProjectManager';
  const addText = addProjectManager
    ? t('project.add_project_manager')
    : roleType === 'LocalManager'
      ? t('project.add_local_manager')
      : t('project.add_project_contributor');

  return (
    <Modal
      headingText={addText}
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
          roleType={roleType}
        />
      )}
    </Modal>
  );
};
