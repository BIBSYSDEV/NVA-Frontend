import { ListItem, ListSubheader } from '@material-ui/core';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { BookType, ChapterType, DegreeType, JournalType, ReportType } from '../../../types/publicationFieldNames';
import { SearchConfig } from '../../../utils/searchHelpers';
import { BaseFilterItem } from './BaseFilterItem';

const StyledIndentedListItem = styled(ListItem)`
  padding-left: 1.5rem;
`;

export const RegistrationTypeFilter = () => {
  const { t } = useTranslation('publicationTypes');
  const { setFieldValue, submitForm, values } = useFormikContext<SearchConfig>();

  const currentValue = values.properties && values.properties[0].value;

  const updateFilter = (type: string) => {
    if (currentValue !== type) {
      const newFilter = {
        fieldName: 'publicationType',
        value: type,
      };
      setFieldValue('properties[0]', newFilter);
    } else {
      setFieldValue('properties[0]', '');
    }
    submitForm();
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
