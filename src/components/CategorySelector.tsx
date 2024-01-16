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
  disabled?: boolean;
}

interface CategorySelectorProps {
  selectedCategories: PublicationInstanceType[];
  onCategoryClick: (category: PublicationInstanceType) => void;
  disabledCategories?: PublicationInstanceType[];
}

export const CategorySelector = ({
  disabledCategories,
  onCategoryClick,
  selectedCategories,
}: CategorySelectorProps) => {
  const { t } = useTranslation();

  const [searchValue, setSearchValue] = useState('');

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
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'auto 1fr' },
          gap: '1rem',
          alignItems: 'center',
        }}>
        <RegistrationTypesRow
          mainType={PublicationType.PublicationInJournal}
          registrationTypes={filterRegistrationTypes(
            Object.values(JournalType).map((registrationType) => ({
              value: registrationType,
              text: t(`registration.publication_types.${registrationType}`),
              selected: selectedCategories.includes(registrationType),
            }))
          )}
          onChangeType={onCategoryClick}
        />
        <RegistrationTypesRow
          mainType={PublicationType.Book}
          registrationTypes={filterRegistrationTypes(
            Object.values(BookType).map((registrationType) => ({
              value: registrationType,
              text: t(`registration.publication_types.${registrationType}`),
              selected: selectedCategories.includes(registrationType),
            }))
          )}
          onChangeType={onCategoryClick}
        />
        <RegistrationTypesRow
          mainType={PublicationType.Report}
          registrationTypes={filterRegistrationTypes(
            Object.values(ReportType).map((registrationType) => ({
              value: registrationType,
              text: t(`registration.publication_types.${registrationType}`),
              selected: selectedCategories.includes(registrationType),
            }))
          )}
          onChangeType={onCategoryClick}
        />
        <RegistrationTypesRow
          mainType={PublicationType.Degree}
          registrationTypes={filterRegistrationTypes(
            Object.values(DegreeType).map((registrationType) => ({
              value: registrationType,
              text: t(`registration.publication_types.${registrationType}`),
              selected: selectedCategories.includes(registrationType),
              disabled: disabledCategories?.includes(registrationType),
            }))
          )}
          onChangeType={onCategoryClick}
        />
        <RegistrationTypesRow
          mainType={PublicationType.Anthology}
          registrationTypes={filterRegistrationTypes(
            Object.values(ChapterType).map((registrationType) => ({
              value: registrationType,
              text: t(`registration.publication_types.${registrationType}`),
              selected: selectedCategories.includes(registrationType),
            }))
          )}
          onChangeType={onCategoryClick}
        />
        <RegistrationTypesRow
          mainType={PublicationType.Presentation}
          registrationTypes={filterRegistrationTypes(
            Object.values(PresentationType).map((registrationType) => ({
              value: registrationType,
              text: t(`registration.publication_types.${registrationType}`),
              selected: selectedCategories.includes(registrationType),
            }))
          )}
          onChangeType={onCategoryClick}
        />
        <RegistrationTypesRow
          mainType={PublicationType.Artistic}
          registrationTypes={filterRegistrationTypes(
            Object.values(ArtisticType).map((registrationType) => ({
              value: registrationType,
              text: t(`registration.publication_types.${registrationType}`),
              selected: selectedCategories.includes(registrationType),
            }))
          )}
          onChangeType={onCategoryClick}
        />
        <RegistrationTypesRow
          mainType={PublicationType.MediaContribution}
          registrationTypes={filterRegistrationTypes(
            Object.values(MediaType).map((registrationType) => ({
              value: registrationType,
              text: t(`registration.publication_types.${registrationType}`),
              selected: selectedCategories.includes(registrationType),
            }))
          )}
          onChangeType={onCategoryClick}
        />
        <RegistrationTypesRow
          mainType={PublicationType.ResearchData}
          registrationTypes={filterRegistrationTypes(
            Object.values(ResearchDataType).map((registrationType) => ({
              value: registrationType,
              text: t(`registration.publication_types.${registrationType}`),
              selected: selectedCategories.includes(registrationType),
            }))
          )}
          onChangeType={onCategoryClick}
        />
        <RegistrationTypesRow
          mainType={PublicationType.ExhibitionContent}
          registrationTypes={filterRegistrationTypes(
            Object.values(ExhibitionContentType).map((registrationType) => ({
              value: registrationType,
              text: t(`registration.publication_types.${registrationType}`),
              selected: selectedCategories.includes(registrationType),
            }))
          )}
          onChangeType={onCategoryClick}
        />
        <RegistrationTypesRow
          mainType={PublicationType.GeographicalContent}
          registrationTypes={filterRegistrationTypes(
            Object.values(OtherRegistrationType).map((registrationType) => ({
              value: registrationType,
              text: t(`registration.publication_types.${registrationType}`),
              selected: selectedCategories.includes(registrationType),
            }))
          )}
          onChangeType={onCategoryClick}
        />
      </Box>
    </>
  );
};

interface RegistrationTypesRowProps {
  onChangeType: (type: PublicationInstanceType) => void;
  mainType: PublicationType;
  registrationTypes: RegistrationTypeElement[];
}

const RegistrationTypesRow = ({ mainType, registrationTypes, onChangeType }: RegistrationTypesRowProps) => {
  const { t } = useTranslation();

  return registrationTypes.length > 0 ? (
    <>
      <Typography fontWeight={700} sx={{ maxWidth: '10rem' }}>
        {t(`registration.publication_types.${mainType}`)}
      </Typography>
      <Box sx={{ display: 'flex', gap: '0.25rem 0.5rem', flexWrap: 'wrap' }}>
        {registrationTypes.map((registrationType) => (
          <CategoryChip key={registrationType.value} category={registrationType} onClickChip={onChangeType} />
        ))}
      </Box>
    </>
  ) : null;
};

interface CategoryChipProps {
  category: RegistrationTypeElement;
  onClickChip: (type: PublicationInstanceType) => void;
}

export const CategoryChip = ({ category, onClickChip }: CategoryChipProps) => {
  const { t } = useTranslation();

  return (
    <Tooltip title={category.disabled ? t('registration.resource_type.protected_type') : ''}>
      <span>
        <Chip
          data-testid={dataTestId.registrationWizard.resourceType.resourceTypeChip(category.value)}
          disabled={category.disabled}
          icon={
            nviApplicableTypes.includes(category.value) ? (
              <FilterVintageIcon
                titleAccess={t('registration.resource_type.nvi.can_give_publication_points')}
                fontSize="small"
              />
            ) : undefined
          }
          variant={category.selected ? 'filled' : 'outlined'}
          color="primary"
          onClick={() => onClickChip(category.value)}
          label={category.text}
        />
      </span>
    </Tooltip>
  );
};
