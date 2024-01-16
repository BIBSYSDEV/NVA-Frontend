import FilterVintageIcon from '@mui/icons-material/FilterVintage';
import SearchIcon from '@mui/icons-material/Search';
import { Box, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  RegistrationTypeElement,
  RegistrationTypesRow,
} from '../pages/registration/resource_type_tab/components/RegistrationTypesRow';
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
