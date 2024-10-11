import { useTranslation } from 'react-i18next';
import { Modal } from '../../components/Modal';
import { CristinProject } from '../../types/project.types';
import { dataTestId } from '../../utils/dataTestIds';
import CreateProject from './project_wizard/CreateProject';

interface ProjectModalProps {
  isOpen: boolean;
  toggleModal: () => void;
  onProjectCreated: (value: CristinProject) => void;
}

export const ProjectModal = ({ isOpen, toggleModal, onProjectCreated }: ProjectModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal
      open={isOpen}
      onClose={toggleModal}
      fullWidth
      maxWidth="lg"
      headingText={t('project.project_modal_title')}
      dataTestId={dataTestId.projectWizard.modal}>
      <CreateProject toggleModal={toggleModal} onProjectCreated={onProjectCreated} />
    </Modal>
  );
};
