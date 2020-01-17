import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { FormControl, MenuItem, Select } from '@material-ui/core';

import { defaultLanguage } from '../../translations/i18n';
import { LanguageCodes, pageLanguages } from '../../types/language.types';
import UserCard from './UserCard';

const StyledFormControl = styled(FormControl)`
  padding-top: 1rem;
  width: 100%;
  max-width: 15rem;
`;

const UserLanguage: React.FC = () => {
  const [languageSelected, setLanguageSelected] = useState<LanguageCodes | string>(defaultLanguage);
  const { t, i18n } = useTranslation('profile');

  useEffect(() => {
    const previouslySelectedLanguage = i18n.language;
    setLanguageSelected(previouslySelectedLanguage);
  }, [i18n.language]);

  const handleLanguageChange = (event: React.ChangeEvent<any>) => {
    const language = event.target.value;
    i18n.changeLanguage(language);
  };

  return (
    <UserCard headerLabel={t('heading.language')}>
      <StyledFormControl variant="outlined">
        <Select value={languageSelected} onChange={handleLanguageChange} data-testid="language-selector">
          {pageLanguages.map(language => (
            <MenuItem value={language.code} key={language.code} data-testid={`user-language-${language.code}`}>
              {language.name}
            </MenuItem>
          ))}
        </Select>
      </StyledFormControl>
    </UserCard>
  );
};

export default UserLanguage;
