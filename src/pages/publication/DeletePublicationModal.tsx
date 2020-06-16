import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import ConfirmDialog from '../../components/ConfirmDialog';

interface DeletePublicationModalProps {
  id: string;
  title: string;
  setOpenModal: (open: boolean) => void;
}

const DeletePublicationModal: FC<DeletePublicationModalProps> = ({ id, title, setOpenModal }) => {
  const { t } = useTranslation();

  const deletePublication = () => {
    // delete publication here
    setOpenModal(false);
  };

  return (
    <ConfirmDialog
      open
      onAccept={deletePublication}
      onCancel={() => setOpenModal(false)}
      title={t('workLists:delete_publication_heading')}>{`${t('workLists:delete_publication_message')} "${
      title ?? t('common:no_title')
    }"`}</ConfirmDialog>
  );
};

export default DeletePublicationModal;
