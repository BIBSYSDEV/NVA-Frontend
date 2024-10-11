import { useTranslation } from 'react-i18next';
import { Modal } from '../../components/Modal';
import { CristinProject, ResearchProject } from '../../types/project.types';
import CreateProject from './project_wizard/CreateProject';

interface ProjectModalProps {
  isOpen: boolean;
  toggleModal: () => void;
  onProjectCreated: (value: CristinProject | ResearchProject) => void;
}

export const ProjectModal = ({ isOpen, toggleModal, onProjectCreated }: ProjectModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal
      title={t('project.project_modal_title')}
      open={isOpen}
      onClose={toggleModal}
      fullWidth
      maxWidth="lg"
      dataTestId="contributor-modal">
      <CreateProject toggleModal={toggleModal} onProjectCreated={onProjectCreated} />
    </Modal>
  );
};
