import { ListItemButton, ListSubheader } from '@mui/material';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  ArtisticType,
  BookType,
  ChapterType,
  DegreeType,
  JournalType,
  PresentationType,
  PublicationType,
  ReportType,
  ResourceFieldNames,
} from '../../../types/publicationFieldNames';
import { ExpressionStatement, PropertySearch, SearchConfig } from '../../../utils/searchHelpers';
import { BaseFilterItem } from './BaseFilterItem';

const StyledIndentedListItem = styled(ListItemButton)<{ $isSelected: boolean }>`
  padding-left: 1.5rem;
  ${({ $isSelected }) => $isSelected && `border: 2px solid;`}
`;

export const RegistrationTypeFilter = () => {
  const { t } = useTranslation('publicationTypes');
  const { setFieldValue, submitForm, values } = useFormikContext<SearchConfig>();

  const properties = values.properties ?? [];

  const registrationTypeIndex = properties.findIndex(
    (property) =>
      property.fieldName === ResourceFieldNames.SubType && property.operator === ExpressionStatement.Contains
  );
  const currentValue = registrationTypeIndex > -1 ? properties[registrationTypeIndex].value : '';

  const updateFilter = (type: string) => {
    const newFilter: PropertySearch = {
      fieldName: ResourceFieldNames.SubType,
      value: currentValue !== type ? type : '',
      operator: ExpressionStatement.Contains,
    };

    const index = registrationTypeIndex > -1 ? registrationTypeIndex : properties.length ?? 0;

    setFieldValue(`properties[${index}]`, newFilter);
    submitForm();
  };

  return (
    <BaseFilterItem title={t('search:registration_type')}>
      <ListSubheader disableSticky>{t(PublicationType.PublicationInJournal)}</ListSubheader>
      {Object.values(JournalType).map((type) => (
        <StyledIndentedListItem key={type} onClick={() => updateFilter(type)} $isSelected={type === currentValue}>
          {t(type)}
        </StyledIndentedListItem>
      ))}
      <ListSubheader disableSticky>{t(PublicationType.Book)}</ListSubheader>
      {Object.values(BookType).map((type) => (
        <StyledIndentedListItem key={type} onClick={() => updateFilter(type)} $isSelected={type === currentValue}>
          {t(type)}
        </StyledIndentedListItem>
      ))}
      <ListSubheader disableSticky>{t(PublicationType.Report)}</ListSubheader>
      {Object.values(ReportType).map((type) => (
        <StyledIndentedListItem key={type} onClick={() => updateFilter(type)} $isSelected={type === currentValue}>
          {t(type)}
        </StyledIndentedListItem>
      ))}
      <ListSubheader disableSticky>{t(PublicationType.Degree)}</ListSubheader>
      {Object.values(DegreeType).map((type) => (
        <StyledIndentedListItem key={type} onClick={() => updateFilter(type)} $isSelected={type === currentValue}>
          {t(type)}
        </StyledIndentedListItem>
      ))}
      <ListSubheader disableSticky>{t(PublicationType.Chapter)}</ListSubheader>
      {Object.values(ChapterType).map((type) => (
        <StyledIndentedListItem key={type} onClick={() => updateFilter(type)} $isSelected={type === currentValue}>
          {t(type)}
        </StyledIndentedListItem>
      ))}
      <ListSubheader disableSticky>{t(PublicationType.Presentation)}</ListSubheader>
      {Object.values(PresentationType).map((type) => (
        <StyledIndentedListItem key={type} onClick={() => updateFilter(type)} $isSelected={type === currentValue}>
          {t(type)}
        </StyledIndentedListItem>
      ))}
      <ListSubheader disableSticky>{t(PublicationType.Artistic)}</ListSubheader>
      {Object.values(ArtisticType).map((type) => (
        <StyledIndentedListItem key={type} onClick={() => updateFilter(type)} $isSelected={type === currentValue}>
          {t(type)}
        </StyledIndentedListItem>
      ))}
    </BaseFilterItem>
  );
};
