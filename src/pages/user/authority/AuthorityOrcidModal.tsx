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

const previouslyLoggedInKey = 'previouslyLoggedIn';

const AuthorityOrcidModal: FC = () => {
  const user = useSelector((store: RootStore) => store.user);
  const [openModal, setOpenModal] = useState(
    localStorage.getItem(previouslyLoggedInKey) && user.authority ? ModalType.NONE : ModalType.AUTHORITY
  );

  useEffect(() => {
    if (user.authority) {
      // Set previouslyLoggedIn in localStorage to avoid opening this modal on every login
      localStorage.setItem(previouslyLoggedInKey, 'true');
    }
  }, [user.authority]);

  const handleNextClick = () => {
    if (user.authority && user.authority.orcids.length === 0) {
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
        <AuthorityModal authority={user.authority} handleNextClick={handleNextClick} />
      )}
      {openModal === ModalType.ORCID && <OrcidModal closeModal={closeModal} />}
    </>
  );
};

export default AuthorityOrcidModal;
