import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { IconButton, Tooltip } from '@mui/material';
import { t } from 'i18next';
import { ReactNode, useState } from 'react';
import { Modal } from '../../components/Modal';

interface HelperTextModalProps {
  modalTitle: string;
  children: ReactNode;
  modalDataTestId?: string;
  buttonDataTestId?: string;
}
export const HelperTextModal = ({ modalTitle, children, modalDataTestId, buttonDataTestId }: HelperTextModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Tooltip title={t('common.help')}>
        <IconButton data-testid={buttonDataTestId} onClick={toggleModal}>
          <HelpOutlineIcon />
        </IconButton>
      </Tooltip>

      {isOpen && (
        <Modal headingText={modalTitle} open={isOpen} onClose={toggleModal} maxWidth="sm" dataTestId={modalDataTestId}>
          {children}
        </Modal>
      )}
    </>
  );
};
