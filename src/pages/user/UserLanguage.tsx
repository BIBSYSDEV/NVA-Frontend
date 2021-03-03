import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { MenuItem, Select, Typography } from '@material-ui/core';
import Card from '../../components/Card';
import { pageLanguages } from '../../types/language.types';

const StyledSelect = styled(Select)`
  margin-top: 1rem;
  width: 100%;
  max-width: 15rem;
`;

export const UserLanguage = () => {
  const { t, i18n } = useTranslation('profile');

  const selectedLanguage = i18n.language;

  return (
    <Card>
      <Typography variant="h2">{t('heading.language')}</Typography>
      <StyledSelect
        variant="outlined"
        value={selectedLanguage}
        onChange={(event) => {
          const language = event.target.value as string;
          i18n.changeLanguage(language);
        }}
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
