import React, { FC, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import AuthorityModal from './AuthorityModal';
import OrcidModal from './OrcidModal';
import { RootStore } from '../../../redux/reducers/rootReducer';

enum ModalType {
  AUTHORITY = 'authority',
  NONE = '',
  ORCID = 'orcid',
}

const AuthorityOrcidModal: FC = () => {
  const [openModal, setOpenModal] = useState(ModalType.AUTHORITY);
  const user = useSelector((store: RootStore) => store.user);

  useEffect(() => {
    if (user.authority) {
      // Set previouslyLoggedIn in localStorage to avoid opening this modal on every login
      localStorage.setItem('previouslyLoggedIn', 'true');
      if (user.authority.orcids.length > 0) {
        setOpenModal(ModalType.NONE);
      }
    }
  }, [user.authority]);

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
