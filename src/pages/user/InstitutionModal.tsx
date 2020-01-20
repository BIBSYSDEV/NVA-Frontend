import React from 'react';
import { useTranslation } from 'react-i18next';

const InstitutionModal: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div>
      <p>{t('change_institution')}</p>
    </div>
  );
};

export default InstitutionModal;
