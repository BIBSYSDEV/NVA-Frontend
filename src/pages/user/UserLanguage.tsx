import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { MenuItem, Select } from '@material-ui/core';

import { defaultLanguage } from '../../translations/i18n';
import { pageLanguages } from '../../types/language.types';
import UserCard from './UserCard';

const StyledSelect = styled(Select)`
  margin-top: 1rem;
  width: 100%;
  max-width: 15rem;
`;

const UserLanguage: React.FC = () => {
  const [languageSelected, setLanguageSelected] = useState<string>(defaultLanguage);
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
    <UserCard headingLabel={t('heading.language')}>
      <StyledSelect
        variant="outlined"
        value={languageSelected}
        onChange={handleLanguageChange}
        data-testid="language-selector">
        {Object.entries(pageLanguages).map(([languageCode, languageName]) => (
          <MenuItem value={languageCode} key={languageCode} data-testid={`user-language-${languageCode}`}>
            {languageName}
          </MenuItem>
        ))}
      </StyledSelect>
    </UserCard>
  );
};

export default UserLanguage;
