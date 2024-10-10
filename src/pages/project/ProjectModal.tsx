import { Modal } from '../../components/Modal';
import CreateProject from './project_wizard/CreateProject';

interface ProjectModalProps {
  isOpen: boolean;
  toggleModal: () => void;
}

export const ProjectModal = ({ isOpen, toggleModal }: ProjectModalProps) => {
  console.log('toggleModal in ProjectModal', toggleModal);
  return (
    <Modal
      title={'test title'}
      open={isOpen}
      onClose={toggleModal}
      fullWidth
      maxWidth="lg"
      dataTestId="contributor-modal">
      <CreateProject toggleModal={toggleModal} />
    </Modal>
  );
};
