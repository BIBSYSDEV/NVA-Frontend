import React from 'react';
import { useTranslation } from 'react-i18next';

import OrcidModalContent from '../OrcidModalContent';
import Modal from '../../../components/Modal';
import orcidLogo from '../../../resources/images/orcid_logo.svg';

interface OrcidModalProps {
  closeModal: () => void;
}

const OrcidModal = ({ closeModal }: OrcidModalProps) => {
  const { t } = useTranslation('common');

  return (
    <Modal
      dataTestId="open-orcid-modal"
      aria-labelledby="orcid-modal"
      open={true}
      onClose={closeModal}
      maxWidth="sm"
      headingIcon={{ src: orcidLogo, alt: 'ORCID iD icon' }}
      headingText={t('profile:orcid.connect_orcid')}>
      <OrcidModalContent cancelText={t('profile:orcid.skip_this_step')} cancelFunction={closeModal} />
    </Modal>
  );
};

export default OrcidModal;
