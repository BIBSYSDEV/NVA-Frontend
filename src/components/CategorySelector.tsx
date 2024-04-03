import FilterVintageIcon from '@mui/icons-material/FilterVintage';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Chip, TextField, Tooltip, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
} from '../types/publicationFieldNames';
import { PublicationInstanceType } from '../types/registration.types';
import { dataTestId } from '../utils/dataTestIds';
import { nviApplicableTypes } from '../utils/registration-helpers';

interface RegistrationTypeElement {
  value: PublicationInstanceType;
  text: string;
  selected: boolean;
  disableText?: string;
}

interface RegistrationRowConfig {
  mainType: PublicationType;
  registrationTypes: PublicationInstanceType[];
}

export interface DisabledCategory {
  type: PublicationInstanceType;
  text: string;
}

const registrationRows: RegistrationRowConfig[] = [
  { mainType: PublicationType.PublicationInJournal, registrationTypes: Object.values(JournalType) },
  { mainType: PublicationType.Book, registrationTypes: Object.values(BookType) },
  { mainType: PublicationType.Report, registrationTypes: Object.values(ReportType) },
  { mainType: PublicationType.Degree, registrationTypes: Object.values(DegreeType) },
  { mainType: PublicationType.Anthology, registrationTypes: Object.values(ChapterType) },
  { mainType: PublicationType.Presentation, registrationTypes: Object.values(PresentationType) },
  { mainType: PublicationType.Artistic, registrationTypes: Object.values(ArtisticType) },
  { mainType: PublicationType.MediaContribution, registrationTypes: Object.values(MediaType) },
  { mainType: PublicationType.ResearchData, registrationTypes: Object.values(ResearchDataType) },
  { mainType: PublicationType.ExhibitionContent, registrationTypes: Object.values(ExhibitionContentType) },
  { mainType: PublicationType.GeographicalContent, registrationTypes: Object.values(OtherRegistrationType) },
];

interface CategorySelectorProps {
  selectedCategories: PublicationInstanceType[];
  onCategoryClick?: (category: PublicationInstanceType) => void;
  disabledCategories?: DisabledCategory[];
  enableNviHighlightning: boolean;
}

export const CategorySelector = ({
  disabledCategories,
  onCategoryClick,
  selectedCategories,
  enableNviHighlightning,
}: CategorySelectorProps) => {
  const { t } = useTranslation();

  const [searchValue, setSearchValue] = useState('');
  const [highlightNviCategories, setHighlightNviCategories] = useState(false);

  const filterRegistrationTypes = (registrationTypes: RegistrationTypeElement[]) => {
    const lowerCaseSearchValue = searchValue.toLowerCase();
    return registrationTypes.filter((registrationType) =>
      registrationType.text.toLowerCase().includes(lowerCaseSearchValue)
    );
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
          mb: '1rem',
        }}>
        <TextField
          data-testid={dataTestId.registrationWizard.resourceType.resourceTypeSearchField}
          type="search"
          variant="filled"
          label={t('common.search')}
          InputProps={{ endAdornment: <SearchIcon /> }}
          onChange={(event) => setSearchValue(event.target.value)}
        />
        {enableNviHighlightning ? (
          <Chip
            icon={
              <FilterVintageIcon
                color="primary"
                titleAccess={t('registration.resource_type.nvi.can_give_publication_points')}
                fontSize="small"
              />
            }
            color="primary"
            onClick={() => setHighlightNviCategories(!highlightNviCategories)}
            data-testid={dataTestId.registrationWizard.resourceType.resourceTypeNviHighLightChipButton}
            variant={highlightNviCategories ? 'filled' : 'outlined'}
            label={t('registration.resource_type.nvi.can_give_publication_points')}
          />
        ) : (
          <Box
            sx={{
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'center',
            }}>
            <FilterVintageIcon
              color="primary"
              titleAccess={t('registration.resource_type.nvi.can_give_publication_points')}
              fontSize="small"
            />
            <Typography>{t('registration.resource_type.nvi.can_give_publication_points')}</Typography>
          </Box>
        )}
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'auto 1fr' },
          gap: '1rem',
          alignItems: 'center',
        }}>
        {registrationRows.map(({ mainType, registrationTypes }) => (
          <RegistrationTypesRow
            key={mainType}
            mainType={mainType}
            higlightNviCategories={highlightNviCategories}
            registrationTypes={filterRegistrationTypes(
              registrationTypes.map((registrationType) => ({
                value: registrationType,
                text: t(`registration.publication_types.${registrationType}`),
                selected: selectedCategories.includes(registrationType),
                disableText: disabledCategories?.find((category) => category.type === registrationType)?.text,
              }))
            )}
            onChangeType={onCategoryClick}
          />
        ))}
      </Box>
    </>
  );
};

interface RegistrationTypesRowProps {
  onChangeType?: (type: PublicationInstanceType) => void;
  mainType: PublicationType;
  registrationTypes: RegistrationTypeElement[];
  higlightNviCategories: boolean;
}

const RegistrationTypesRow = ({
  mainType,
  registrationTypes,
  onChangeType,
  higlightNviCategories,
}: RegistrationTypesRowProps) => {
  const { t } = useTranslation();

  return registrationTypes.length > 0 ? (
    <>
      <Typography fontWeight={700} sx={{ maxWidth: '10rem' }}>
        {t(`registration.publication_types.${mainType}`)}
      </Typography>
      <Box sx={{ display: 'flex', gap: '0.25rem 0.5rem', flexWrap: 'wrap' }}>
        {registrationTypes.map((registrationType) => (
          <CategoryChip
            key={registrationType.value}
            higlightNviCategories={higlightNviCategories}
            category={registrationType}
            onClickChip={onChangeType}
          />
        ))}
      </Box>
    </>
  ) : null;
};

interface CategoryChipProps {
  category: RegistrationTypeElement;
  onClickChip?: (type: PublicationInstanceType) => void;
  higlightNviCategories?: boolean;
}

export const CategoryChip = ({ category, onClickChip, higlightNviCategories }: CategoryChipProps) => {
  const { t } = useTranslation();

  const isHighlightedNviCategory = (value: PublicationInstanceType): boolean => {
    return nviApplicableTypes.includes(value) && !!higlightNviCategories;
  };
  return (
    <Tooltip title={category.disableText}>
      <span>
        <Chip
          data-testid={dataTestId.registrationWizard.resourceType.resourceTypeChip(category.value)}
          disabled={!!category.disableText}
          icon={
            nviApplicableTypes.includes(category.value) ? (
              <FilterVintageIcon
                titleAccess={t('registration.resource_type.nvi.can_give_publication_points')}
                fontSize="small"
              />
            ) : undefined
          }
          variant={category.selected || isHighlightedNviCategory(category.value) ? 'filled' : 'outlined'}
          color="primary"
          onClick={onClickChip ? () => onClickChip(category.value) : undefined}
          label={category.text}
        />
      </span>
    </Tooltip>
  );
};
