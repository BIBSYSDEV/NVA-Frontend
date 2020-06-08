import React, { FC, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { Authority } from '../../../types/authority.types';
import AuthorityModal from './AuthorityModal';
import OrcidModal from './OrcidModal';
import { RootStore } from '../../../redux/reducers/rootReducer';

interface AuthorityOrcidModalProps {
  authority: Authority | null;
}

enum ModalType {
  AUTHORITY = 'authority',
  NONE = '',
  ORCID = 'orcid',
}

const AuthorityOrcidModal: FC<AuthorityOrcidModalProps> = ({ authority }) => {
  const [openModal, setOpenModal] = useState(ModalType.AUTHORITY);
  const user = useSelector((store: RootStore) => store.user);

  useEffect(() => {
    // Set previouslyLoggedIn in localStorage to avoid opening this modal on every login
    localStorage.setItem('previouslyLoggedIn', 'true');
  }, []);

  const handleNextClick = () => {
    setOpenModal(ModalType.ORCID);
  };

  const closeModal = () => {
    setOpenModal(ModalType.NONE);
  };

  return (
    <>
      {openModal === ModalType.AUTHORITY && (
        <AuthorityModal authority={user.authority} closeModal={closeModal} handleNextClick={handleNextClick} />
      )}
      {openModal === ModalType.ORCID && <OrcidModal closeModal={closeModal} />}
    </>
  );
};

export default AuthorityOrcidModal;
