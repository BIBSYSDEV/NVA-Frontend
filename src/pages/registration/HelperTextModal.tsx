import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Breakpoint, IconButton, Tooltip } from '@mui/material';
import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '../../components/Modal';

interface HelperTextModalProps {
  modalTitle: string;
  children: ReactNode;
  modalDataTestId?: string;
  buttonDataTestId?: string;
  maxWidth?: Breakpoint;
}

export const HelperTextModal = ({
  modalTitle,
  children,
  modalDataTestId,
  buttonDataTestId,
  maxWidth = 'sm',
}: HelperTextModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

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
        <Modal
          headingText={modalTitle}
          open={isOpen}
          onClose={toggleModal}
          maxWidth={maxWidth}
          dataTestId={modalDataTestId}>
          {children}
        </Modal>
      )}
    </>
  );
};
