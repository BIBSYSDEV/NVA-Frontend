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
  return (
    <Modal open={isOpen} onClose={toggleModal} fullWidth maxWidth="lg" dataTestId={dataTestId.projectWizard.modal}>
      <CreateProject toggleModal={toggleModal} onProjectCreated={onProjectCreated} />
    </Modal>
  );
};
