import React, { FC, useState } from 'react';
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
  const { authority } = useSelector((store: RootStore) => store.user);
  const [openModal, setOpenModal] = useState(authority ? ModalType.NONE : ModalType.AUTHORITY);

  const handleNextClick = () => {
    if (authority && authority.orcids.length === 0) {
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
        <AuthorityModal authority={authority} closeModal={closeModal} handleNextClick={handleNextClick} />
      )}
      {openModal === ModalType.ORCID && <OrcidModal closeModal={closeModal} />}
    </>
  );
};

export default AuthorityOrcidModal;
