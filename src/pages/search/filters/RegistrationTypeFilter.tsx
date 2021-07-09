import { ListItem, ListSubheader } from '@material-ui/core';
import { useEffect } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { BookType, ChapterType, DegreeType, JournalType, ReportType } from '../../../types/publicationFieldNames';
import { BaseFilterItem } from './BaseFilterItem';

const StyledIndentedListItem = styled(ListItem)`
  padding-left: 1.5rem;
`;
const key = 'publicationType';

export const RegistrationTypeFilter = () => {
  const { t } = useTranslation('publicationTypes');

  const history = useHistory();

  const updateFilter = (type: string) => {
    const currentParams = new URLSearchParams(history.location.search);
    const old = currentParams.get('query');
    currentParams.set('query', old ? `${old} AND (${key}:${type})` : `(${key}:${type})`);
    history.push({ search: currentParams.toString() });
  };

  return (
    <BaseFilterItem title={t('common:type')}>
      <ListSubheader disableSticky>{t('Journal')}</ListSubheader>
      {Object.values(JournalType).map((type) => (
        <StyledIndentedListItem key={type} button onClick={() => updateFilter(type)}>
          {t(type)}
        </StyledIndentedListItem>
      ))}
      <ListSubheader disableSticky>{t('Book')}</ListSubheader>
      {Object.values(BookType).map((type) => (
        <StyledIndentedListItem key={type} button onClick={() => updateFilter(type)}>
          {t(type)}
        </StyledIndentedListItem>
      ))}
      <ListSubheader disableSticky>{t('Report')}</ListSubheader>
      {Object.values(ReportType).map((type) => (
        <StyledIndentedListItem key={type} button onClick={() => updateFilter(type)}>
          {t(type)}
        </StyledIndentedListItem>
      ))}
      <ListSubheader disableSticky>{t('Degree')}</ListSubheader>
      {Object.values(DegreeType).map((type) => (
        <StyledIndentedListItem key={type} button onClick={() => updateFilter(type)}>
          {t(type)}
        </StyledIndentedListItem>
      ))}
      <ListSubheader disableSticky>{t('Chapter')}</ListSubheader>
      {Object.values(ChapterType).map((type) => (
        <StyledIndentedListItem key={type} button onClick={() => updateFilter(type)}>
          {t(type)}
        </StyledIndentedListItem>
      ))}
    </BaseFilterItem>
  );
};
