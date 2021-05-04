import React from 'react';
import { ListSubheader, MenuItem, TextField, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { BookType, ChapterType, DegreeType, JournalType, ReportType } from '../../types/publicationFieldNames';

const StyledSelect = styled(TextField)`
  margin-top: 0rem;
  width: 13rem;
`;

const StyledFilterRow = styled.div`
  display: flex;
  align-items: center;

  > :not(:first-child) {
    margin-left: 1rem;
  }
`;

export const RegistrationFilters = () => {
  const { t } = useTranslation('publicationTypes');
  const history = useHistory();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const paramType = params.get('type') ?? '';

  const onClickType = (type: string) => {
    if (type) {
      params.set('type', type);
    } else {
      params.delete('type');
    }
    history.push({ search: params.toString() });
  };

  return (
    <StyledFilterRow>
      <Typography variant="subtitle2" component="p">
        {t('common:filter')}:
      </Typography>
      <StyledSelect
        value={paramType}
        variant="filled"
        label={t('common:registration_type')}
        select
        onChange={(event) => onClickType(event.target.value)}>
        <MenuItem value="">
          <em>{t('common:none')}</em>
        </MenuItem>
        <ListSubheader disableSticky>{t('Journal')}</ListSubheader>
        {Object.values(JournalType).map((type) => (
          <MenuItem key={type} value={type}>
            {t(type)}
          </MenuItem>
        ))}
        <ListSubheader>{t('Book')}</ListSubheader>
        {Object.values(BookType).map((type) => (
          <MenuItem key={type} value={type}>
            {t(type)}
          </MenuItem>
        ))}
        <ListSubheader>{t('Report')}</ListSubheader>
        {Object.values(ReportType).map((type) => (
          <MenuItem key={type} value={type}>
            {t(type)}
          </MenuItem>
        ))}
        <ListSubheader>{t('Degree')}</ListSubheader>
        {Object.values(DegreeType).map((type) => (
          <MenuItem key={type} value={type}>
            {t(type)}
          </MenuItem>
        ))}
        <ListSubheader>{t('Chapter')}</ListSubheader>
        {Object.values(ChapterType).map((type) => (
          <MenuItem key={type} value={type}>
            {t(type)}
          </MenuItem>
        ))}
      </StyledSelect>
    </StyledFilterRow>
  );
};
