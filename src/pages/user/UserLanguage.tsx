import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { MenuItem, Select } from '@material-ui/core';

import { pageLanguages } from '../../types/language.types';
import Card from '../../components/Card';
import Heading from '../../components/Heading';

const StyledSelect = styled(Select)`
  margin-top: 1rem;
  width: 100%;
  max-width: 15rem;
`;

const UserLanguage: React.FC = () => {
  const { t, i18n } = useTranslation('profile');

  const handleLanguageChange = (event: React.ChangeEvent<any>) => {
    const language = event.target.value;
    i18n.changeLanguage(language);
  };

  return (
    <Card>
      <Heading>{t('heading.language')}</Heading>
      <StyledSelect
        variant="outlined"
        value={i18n.language}
        onChange={handleLanguageChange}
        data-testid="language-selector">
        {pageLanguages.map((language) => (
          <MenuItem value={language} key={language} data-testid={`user-language-${language}`}>
            {t(`languages:${language}`)}
          </MenuItem>
        ))}
      </StyledSelect>
    </Card>
  );
};

export default UserLanguage;
