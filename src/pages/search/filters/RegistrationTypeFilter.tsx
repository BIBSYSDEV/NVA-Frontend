import { ListItem, ListSubheader } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { BookType, ChapterType, DegreeType, JournalType, ReportType } from '../../../types/publicationFieldNames';
import { BaseFilterItem } from './BaseFilterItem';

const StyledIndentedListItem = styled(ListItem)`
  padding-left: 1.5rem;
`;

export const RegistrationTypeFilter = () => {
  const { t } = useTranslation('publicationTypes');

  return (
    <BaseFilterItem title="Type">
      <ListSubheader disableSticky>{t('Journal')}</ListSubheader>
      {Object.values(JournalType).map((type) => (
        <StyledIndentedListItem key={type} button>
          {t(type)}
        </StyledIndentedListItem>
      ))}
      <ListSubheader disableSticky>{t('Book')}</ListSubheader>
      {Object.values(BookType).map((type) => (
        <StyledIndentedListItem key={type} button>
          {t(type)}
        </StyledIndentedListItem>
      ))}
      <ListSubheader disableSticky>{t('Report')}</ListSubheader>
      {Object.values(ReportType).map((type) => (
        <StyledIndentedListItem key={type} button>
          {t(type)}
        </StyledIndentedListItem>
      ))}
      <ListSubheader disableSticky>{t('Degree')}</ListSubheader>
      {Object.values(DegreeType).map((type) => (
        <StyledIndentedListItem key={type} button>
          {t(type)}
        </StyledIndentedListItem>
      ))}
      <ListSubheader disableSticky>{t('Chapter')}</ListSubheader>
      {Object.values(ChapterType).map((type) => (
        <StyledIndentedListItem key={type} button>
          {t(type)}
        </StyledIndentedListItem>
      ))}
    </BaseFilterItem>
  );
};
