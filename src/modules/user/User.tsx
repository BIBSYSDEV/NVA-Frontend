import { Button } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import '../../styles/user.scss';
import { Language } from '../../types/settings.types';

const User: React.FC = () => {
  const { t, i18n } = useTranslation();

  return (
    <div className="user">
      {t('My profile')}
      <div>
        <Button onClick={() => i18n.changeLanguage(Language.NORWEGIAN_BOKMAL)}>Skifte til norsk språk</Button>
      </div>
      <div>
        <Button onClick={() => i18n.changeLanguage(Language.ENGLISH)}>Change language to english</Button>
      </div>
    </div>
  );
};

export default User;
