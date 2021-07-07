import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { MenuItem, TextField, Typography } from '@material-ui/core';
import { Card } from '../../components/Card';
import { pageLanguages } from '../../types/language.types';

const StyledSelect = styled(TextField)`
  margin-top: 1rem;
  width: 100%;
  max-width: 15rem;
`;

export const UserLanguage = () => {
  const { t, i18n } = useTranslation('profile');

  return (
    <Card>
      <Typography variant="h2">{t('heading.settings')}</Typography>
      <StyledSelect
        variant="outlined"
        value={i18n.language}
        select
        label={t('common:language')}
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
