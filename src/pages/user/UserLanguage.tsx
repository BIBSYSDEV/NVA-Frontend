import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { MenuItem, Select, Typography } from '@material-ui/core';
import { pageLanguages, LanguageCodes } from '../../types/language.types';
import Card from '../../components/Card';
import { fallbackLanguage } from '../../translations/i18n';

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

  const selectedLanguage = Object.values(LanguageCodes).some((language) => language === i18n.language)
    ? i18n.language
    : fallbackLanguage;

  return (
    <Card>
      <Typography variant="h5">{t('heading.language')}</Typography>
      <StyledSelect
        variant="outlined"
        value={selectedLanguage}
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
