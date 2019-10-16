import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { FormControl, MenuItem, Select } from '@material-ui/core';

import { defaultLanguage, languages } from '../../translations/i18n';
import { Language } from '../../types/settings.types';
import UserCard from './UserCard';

const UserLanguage: React.FC = () => {
  const [languageSelected, setLanguageSelected] = useState<Language | string>(defaultLanguage);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const previouslySelectedLanguage = i18n.language;
    setLanguageSelected(previouslySelectedLanguage);
  }, [i18n.language]);

  const handleLanguageChange = (event: React.ChangeEvent<any>) => {
    const language = event.target.value;
    setLanguageSelected(language);
    i18n.changeLanguage(language);
  };

  return (
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
  );
};

export default UserLanguage;
