import { Autocomplete, Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { AutocompleteTextField } from '../../../../components/AutocompleteTextField';
import {
  ArtisticType,
  BookType,
  ChapterType,
  DegreeType,
  ExhibitionContentType,
  JournalType,
  MediaType,
  OtherRegistrationType,
  PresentationType,
  PublicationType,
  ReportType,
  ResearchDataType,
} from '../../../../types/publicationFieldNames';
import { PublicationInstanceType } from '../../../../types/registration.types';
import { dataTestId } from '../../../../utils/dataTestIds';

const createOptions = (enumObj: object, parentCategory: PublicationType) =>
  Object.values(enumObj).map((category: PublicationInstanceType) => ({ parentCategory, category }));

const options = [
  ...createOptions(JournalType, PublicationType.PublicationInJournal),
  ...createOptions(BookType, PublicationType.Book),
  ...createOptions(ReportType, PublicationType.Report),
  ...createOptions(DegreeType, PublicationType.Degree),
  ...createOptions(ChapterType, PublicationType.Anthology),
  ...createOptions(PresentationType, PublicationType.Presentation),
  ...createOptions(ArtisticType, PublicationType.Artistic),
  ...createOptions(MediaType, PublicationType.MediaContribution),
  ...createOptions(ResearchDataType, PublicationType.ResearchData),
  ...createOptions(ExhibitionContentType, PublicationType.ExhibitionContent),
  ...createOptions(OtherRegistrationType, PublicationType.GeographicalContent),
];

interface SelectCategoryFacetItemProps {
  onSelectCategory: (category: PublicationInstanceType) => void;
}

export const SelectCategoryFacetItem = ({ onSelectCategory }: SelectCategoryFacetItemProps) => {
  const { t } = useTranslation();

  return (
    <Autocomplete
      fullWidth
      size="small"
      sx={{ p: '0.25rem 0.5rem' }}
      options={options}
      groupBy={(option) => option.parentCategory}
      renderGroup={(params) => (
        <Box component="li" sx={{ ':not(:first-of-type)': { mt: '1rem' } }} key={params.key}>
          <Typography sx={{ m: '0.5rem', fontWeight: 'bold' }}>
            {t(`registration.publication_types.${params.group as PublicationType}`)}
          </Typography>
          <Box component="ul" sx={{ p: 0 }}>
            {params.children}
          </Box>
        </Box>
      )}
      inputMode="search"
      getOptionLabel={(option) => t(`registration.publication_types.${option.category}`)}
      onChange={(_, selectedCategory) => {
        if (selectedCategory) {
          onSelectCategory(selectedCategory.category);
        }
      }}
      renderInput={(params) => (
        <AutocompleteTextField
          {...params}
          variant="outlined"
          data-testid={dataTestId.aggregations.categoryFacetsSearchField}
          aria-label={t('registration.resource_type.select_resource_type')}
          placeholder={t('registration.resource_type.select_resource_type')}
          showSearchIcon
        />
      )}
    />
  );
};
