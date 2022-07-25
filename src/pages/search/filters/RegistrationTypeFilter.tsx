import { ListItemButton, ListSubheader } from '@mui/material';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { styled as muiStyled } from '@mui/system';
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

interface StyledIndentedListItemProps {
  isSelected: boolean;
}

const StyledIndentedListItem = muiStyled(ListItemButton, { shouldForwardProp: (prop) => prop !== 'isSelected' })(
  ({ isSelected }: StyledIndentedListItemProps) => ({
    paddingLeft: '1.5rem',
    border: isSelected ? '2px solid' : 'none',
  })
);

export const RegistrationTypeFilter = () => {
  const { t } = useTranslation();
  const { setFieldValue, submitForm, values } = useFormikContext<SearchConfig>();

  const properties = values.properties ?? [];

  const typeFilterIndex = properties.findIndex(
    (property) =>
      property.fieldName === ResourceFieldNames.SubType && property.operator === ExpressionStatement.Contains
  );
  const currentValue = typeFilterIndex > -1 ? properties[typeFilterIndex].value : '';

  const updateFilter = (type: string) => {
    const newFilter: PropertySearch = {
      fieldName: ResourceFieldNames.SubType,
      value: currentValue !== type ? type : '',
      operator: ExpressionStatement.Contains,
    };

    const index = typeFilterIndex > -1 ? typeFilterIndex : properties.length ?? 0;

    setFieldValue(`properties[${index}]`, newFilter);
    submitForm();
  };

  return (
    <BaseFilterItem title={t('search.registration_type')}>
      <ListSubheader disableSticky>
        {t(`registration.publication_types.${PublicationType.PublicationInJournal}`)}
      </ListSubheader>
      {Object.values(JournalType).map((type) => (
        <StyledIndentedListItem key={type} onClick={() => updateFilter(type)} isSelected={type === currentValue}>
          {t(type)}
        </StyledIndentedListItem>
      ))}
      <ListSubheader disableSticky>{t(`registration.publication_types.${PublicationType.Book}`)}</ListSubheader>
      {Object.values(BookType).map((type) => (
        <StyledIndentedListItem key={type} onClick={() => updateFilter(type)} isSelected={type === currentValue}>
          {t(type)}
        </StyledIndentedListItem>
      ))}
      <ListSubheader disableSticky>{t(`registration.publication_types.${PublicationType.Report}`)}</ListSubheader>
      {Object.values(ReportType).map((type) => (
        <StyledIndentedListItem key={type} onClick={() => updateFilter(type)} isSelected={type === currentValue}>
          {t(type)}
        </StyledIndentedListItem>
      ))}
      <ListSubheader disableSticky>{t(`registration.publication_types.${PublicationType.Degree}`)}</ListSubheader>
      {Object.values(DegreeType).map((type) => (
        <StyledIndentedListItem key={type} onClick={() => updateFilter(type)} isSelected={type === currentValue}>
          {t(type)}
        </StyledIndentedListItem>
      ))}
      <ListSubheader disableSticky>{t(`registration.publication_types.${PublicationType.Chapter}`)}</ListSubheader>
      {Object.values(ChapterType).map((type) => (
        <StyledIndentedListItem key={type} onClick={() => updateFilter(type)} isSelected={type === currentValue}>
          {t(type)}
        </StyledIndentedListItem>
      ))}
      <ListSubheader disableSticky>{t(`registration.publication_types.${PublicationType.Presentation}`)}</ListSubheader>
      {Object.values(PresentationType).map((type) => (
        <StyledIndentedListItem key={type} onClick={() => updateFilter(type)} isSelected={type === currentValue}>
          {t(type)}
        </StyledIndentedListItem>
      ))}
      <ListSubheader disableSticky>{t(`registration.publication_types.${PublicationType.Artistic}`)}</ListSubheader>
      {Object.values(ArtisticType).map((type) => (
        <StyledIndentedListItem key={type} onClick={() => updateFilter(type)} isSelected={type === currentValue}>
          {t(type)}
        </StyledIndentedListItem>
      ))}
    </BaseFilterItem>
  );
};
