import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { IconButton, Tooltip } from '@mui/material';
import { t } from 'i18next';
import { ReactNode, useState } from 'react';
import { Modal } from '../../components/Modal';
import { dataTestId } from '../../utils/dataTestIds';

interface HelperTextModalProps {
  modalTitle: string;
  children: ReactNode;
}
export const HelperTextModal = ({ modalTitle, children }: HelperTextModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Tooltip title={t('common.help')}>
        <IconButton data-testid={dataTestId.registrationWizard.files.versionHelpButton} onClick={toggleModal}>
          <HelpOutlineIcon />
        </IconButton>
      </Tooltip>

      {isOpen && (
        <Modal headingText={modalTitle} open={isOpen} onClose={toggleModal} maxWidth="sm">
          {children}
        </Modal>
      )}
    </>
  );
};
