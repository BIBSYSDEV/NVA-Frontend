import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import ConfirmDialog from '../../components/ConfirmDialog';
import NormalText from '../../components/NormalText';

interface DeleteRegistrationModalProps {
  id: string;
  title: string;
  setOpenModal: (open: boolean) => void;
}

const DeleteRegistrationModal: FC<DeleteRegistrationModalProps> = ({ id, title, setOpenModal }) => {
  const { t } = useTranslation();

  const deleteRegistration = () => {
    // delete registration here
    setOpenModal(false);
  };

  return (
    <ConfirmDialog
      open
      onAccept={deleteRegistration}
      onCancel={() => setOpenModal(false)}
      title={t('workLists:delete_registration')}>
      <NormalText>{`${t('workLists:delete_registration_message')} "${title ?? t('common:no_title')}"`}</NormalText>
    </ConfirmDialog>
  );
};

export default DeleteRegistrationModal;
