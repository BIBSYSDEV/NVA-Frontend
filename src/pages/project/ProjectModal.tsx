import { useTranslation } from 'react-i18next';
import { Modal } from '../../components/Modal';
import CreateProject from './project_wizard/CreateProject';

interface ProjectModalProps {
  isOpen: boolean;
  toggleModal: () => void;
}

export const ProjectModal = ({ isOpen, toggleModal }: ProjectModalProps) => {
  const { t } = useTranslation();
  console.log('toggleModal in ProjectModal', toggleModal);
  return (
    <Modal
      title={t('project.project_modal_title')}
      open={isOpen}
      onClose={toggleModal}
      fullWidth
      maxWidth="lg"
      dataTestId="contributor-modal">
      <CreateProject toggleModal={toggleModal} />
    </Modal>
  );
};
