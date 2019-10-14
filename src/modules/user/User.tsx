import '../../styles/user.scss';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { FormControl, MenuItem, Select } from '@material-ui/core';

import { RootStore } from '../../reducers/rootReducer';
import { defaultLanguage, languages } from '../../translations/i18n';
import LabelTextLine from './LabelTextLine';
import UserCard from './UserCard';

const User: React.FC = () => {
  const { t, i18n } = useTranslation();

  const user = useSelector((state: RootStore) => state.user);

  const [languageSelected, setLanguageSelected] = useState(defaultLanguage);

  const handleLanguageChange = (event: React.ChangeEvent<any>) => {
    const language = event.target.value;
    setLanguageSelected(language);
    i18n.changeLanguage(language);
  };

  return (
    <div className="user">
      <div className="secondary-info">
        <div className="user__profile-image"></div>

        <UserCard headerLabel={t('Contact')} className="user__contact-info"></UserCard>

        <UserCard headerLabel={t('Language')} className="user__language">
          <FormControl variant="outlined">
            <Select value={languageSelected} onChange={handleLanguageChange}>
              {languages.map(language => (
                <MenuItem value={language.code} key={language.code}>
                  {language.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </UserCard>

        <UserCard headerLabel={t('Author information')} className="user__author-info" />
      </div>

      <div className="primary-info">
        <UserCard
          headerLabel={t('User information')}
          subHeaderLabel={t('Info from Feide')}
          className="user__feide-info">
          <LabelTextLine dataCy="user-name" label={t('Name')} textValue={user.name} />
          <LabelTextLine dataCy="user-id" label={t('ID')} textValue={user.id} />
          <LabelTextLine dataCy="user-email" label={t('Email')} textValue={user.email} />
          <LabelTextLine dataCy="user-institution" label={t('Institution')} textValue={user.institution} />
        </UserCard>
        <UserCard headerLabel={t('Roles')} className="user__roles" />
        <UserCard headerLabel={t('Organizations')} className="user__organizations" />
        <UserCard headerLabel={t('ORCID')} className="user__orcid-info" />
      </div>
    </div>
  );
};

export default User;
