import { Button, Typography } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import '../../styles/user.scss';
import { Language } from '../../types/settings.types';
import { useSelector } from 'react-redux';
import { RootStore } from '../../reducers/rootReducer';
import UserCard from './UserCard';

const User: React.FC = () => {
  const { t, i18n } = useTranslation();

  const user = useSelector((state: RootStore) => state.user);

  return (
    <div className="user">
      <div className="secondary-info">
        <div className="user__profile-image"></div>

        <UserCard headerLabel={t('Contact')} className="user__contact-info"></UserCard>

        <UserCard headerLabel={t('Language')} className="user__language">
          <Button onClick={() => i18n.changeLanguage(Language.NORWEGIAN_BOKMAL)}>Skifte til norsk språk</Button>
          <Button onClick={() => i18n.changeLanguage(Language.ENGLISH)}>Change language to english</Button>
        </UserCard>

        <UserCard headerLabel={t('Author information')} className="user__author-info" />
      </div>

      <div className="primary-info">
        <UserCard
          headerLabel={t('User information')}
          subHeaderLabel={t('Info from Feide')}
          className="user__feide-info">
          <p>
            <div className="label">{t('Name')}:</div>
            <div className="value">{user.name}</div>
          </p>
          <p>
            <div className="label">{t('ID')}:</div>
            <div className="value">{user.id}</div>
          </p>
          <p>
            <div className="label">{t('Email')}:</div>
            <div className="value">{user.email}</div>
          </p>
          <p>
            <div className="label">{t('Institution')}:</div>
            <div className="value">{user.institution}</div>
          </p>
        </UserCard>
        <div className="user__roles box">
          <h2>{t('Roles')}</h2>
        </div>
        <div className="user__organizations box">
          <h2>{t('Organizations')}</h2>
        </div>
        <div className="user__orcid-info box">
          <h2>{t('ORCID')}</h2>
        </div>
      </div>
    </div>
  );
};

export default User;
