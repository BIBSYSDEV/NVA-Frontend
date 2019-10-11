import { Button } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import '../../styles/user.scss';
import { Language } from '../../types/settings.types';

const User: React.FC = () => {
  const { t, i18n } = useTranslation();

  return (
    <div className="user">
      <div className="secondary-info">
        <div className="user__profile-image box">Bilde</div>
        <div className="user__contact-info  box">Kontakt</div>
        <div className="user__language  box">
          <Button onClick={() => i18n.changeLanguage(Language.NORWEGIAN_BOKMAL)}>Skifte til norsk språk</Button>
          <Button onClick={() => i18n.changeLanguage(Language.ENGLISH)}>Change language to english</Button>
        </div>
        <div className="user__author-info box">Forfatter-info</div>
      </div>
      <div className="primary-info">
        <div className="user__feide-info box">Feide-info</div>
        <div className="user__roles box">Roller</div>
        <div className="user__organizations box">Tilhørighet</div>
        <div className="user__orcid-info box">Orcid</div>
      </div>
    </div>
  );
};

export default User;
