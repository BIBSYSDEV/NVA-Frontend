import { ListItem, ListSubheader } from '@material-ui/core';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { BookType, ChapterType, DegreeType, JournalType, ReportType } from '../../../types/publicationFieldNames';
import { SearchFieldName } from '../../../types/search.types';
import { SearchConfig } from '../../../utils/searchHelpers';
import { BaseFilterItem } from './BaseFilterItem';

const StyledIndentedListItem = styled(ListItem)<{ $isSelected: boolean }>`
  padding-left: 1.5rem;
  ${({ $isSelected }) => $isSelected && `border: 2px solid;`}
`;

export const RegistrationTypeFilter = () => {
  const { t } = useTranslation('publicationTypes');
  const { setFieldValue, submitForm, values } = useFormikContext<SearchConfig>();

  const currentValue = (values.properties?.length && values.properties[0].value) ?? '';

  const updateFilter = (type: string) => {
    const newFilter = {
      fieldName: SearchFieldName.Subtype,
      value: currentValue !== type ? type : '',
    };
    setFieldValue('properties[0]', newFilter);
    submitForm();
  };

  return (
    <BaseFilterItem title={t('registration_type')}>
      <ListSubheader disableSticky>{t('Journal')}</ListSubheader>
      {Object.values(JournalType).map((type) => (
        <StyledIndentedListItem
          key={type}
          button
          onClick={() => updateFilter(type)}
          $isSelected={type === currentValue}>
          {t(type)}
        </StyledIndentedListItem>
      ))}
      <ListSubheader disableSticky>{t('Book')}</ListSubheader>
      {Object.values(BookType).map((type) => (
        <StyledIndentedListItem
          key={type}
          button
          onClick={() => updateFilter(type)}
          $isSelected={type === currentValue}>
          {t(type)}
        </StyledIndentedListItem>
      ))}
      <ListSubheader disableSticky>{t('Report')}</ListSubheader>
      {Object.values(ReportType).map((type) => (
        <StyledIndentedListItem
          key={type}
          button
          onClick={() => updateFilter(type)}
          $isSelected={type === currentValue}>
          {t(type)}
        </StyledIndentedListItem>
      ))}
      <ListSubheader disableSticky>{t('Degree')}</ListSubheader>
      {Object.values(DegreeType).map((type) => (
        <StyledIndentedListItem
          key={type}
          button
          onClick={() => updateFilter(type)}
          $isSelected={type === currentValue}>
          {t(type)}
        </StyledIndentedListItem>
      ))}
      <ListSubheader disableSticky>{t('Chapter')}</ListSubheader>
      {Object.values(ChapterType).map((type) => (
        <StyledIndentedListItem
          key={type}
          button
          onClick={() => updateFilter(type)}
          $isSelected={type === currentValue}>
          {t(type)}
        </StyledIndentedListItem>
      ))}
    </BaseFilterItem>
  );
};
