import { useState } from 'react';

import { AuthorityModal } from './AuthorityModal';
import { OrcidModal } from './OrcidModal';
import { User } from '../../../types/user.types';

enum ModalType {
  AUTHORITY = 'authority',
  NONE = '',
  ORCID = 'orcid',
}

interface AuthorityOrcidModalProps {
  user: User;
}

export const AuthorityOrcidModal = ({ user }: AuthorityOrcidModalProps) => {
  const [openModal, setOpenModal] = useState(user.authority ? ModalType.NONE : ModalType.AUTHORITY);

  const handleNextClick = () => {
    if (user.authority?.orcids.length === 0) {
      setOpenModal(ModalType.ORCID);
    } else {
      closeModal();
    }
  };

  const closeModal = () => {
    setOpenModal(ModalType.NONE);
  };

  return (
    <>
      {openModal === ModalType.AUTHORITY && (
        <AuthorityModal user={user} closeModal={closeModal} handleNextClick={handleNextClick} />
      )}
      {openModal === ModalType.ORCID && <OrcidModal closeModal={closeModal} />}
    </>
  );
};
