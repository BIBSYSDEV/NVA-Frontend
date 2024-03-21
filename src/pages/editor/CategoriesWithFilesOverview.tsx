import FilterVintageIcon from '@mui/icons-material/FilterVintage';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Chip, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { registrationRows, RegistrationTypeElement } from '../../components/CategorySelector';
import { RootState } from '../../redux/store';
import { PublicationType } from '../../types/publicationFieldNames';
import { dataTestId } from '../../utils/dataTestIds';
import { nviApplicableTypes } from '../../utils/registration-helpers';

export const CategoriesWithFilesOverview = () => {
  const { t } = useTranslation();
  const customer = useSelector((store: RootState) => store.customer);
  const selectedCategories = customer?.allowFileUploadForTypes ?? [];
  const [searchValue, setSearchValue] = useState('');

  const filterRegistrationTypes = (registrationTypes: RegistrationTypeElement[]) => {
    const lowerCaseSearchValue = searchValue.toLowerCase();
    return registrationTypes.filter((registrationType) =>
      registrationType.text.toLowerCase().includes(lowerCaseSearchValue)
    );
  };

  return (
    <>
      <Helmet>
        <title>{t('editor.categories_with_files')}</title>
      </Helmet>

      <Typography variant="h2" gutterBottom>
        {t('editor.categories_with_files')}
      </Typography>

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
        {registrationRows.map(({ mainType, registrationTypes }) => (
          <RegistrationTypesRow
            key={mainType}
            mainType={mainType}
            registrationTypes={filterRegistrationTypes(
              registrationTypes.map((registrationType) => ({
                value: registrationType,
                text: t(`registration.publication_types.${registrationType}`),
                selected: selectedCategories.includes(registrationType),
              }))
            )}
          />
        ))}
      </Box>
    </>
  );
};

interface RegistrationTypesRowProps {
  mainType: PublicationType;
  registrationTypes: RegistrationTypeElement[];
}

const RegistrationTypesRow = ({ mainType, registrationTypes }: RegistrationTypesRowProps) => {
  const { t } = useTranslation();

  return registrationTypes.length > 0 ? (
    <>
      <Typography fontWeight="bold" sx={{ maxWidth: '10rem' }}>
        {t(`registration.publication_types.${mainType}`)}
      </Typography>
      <Box sx={{ display: 'flex', gap: '0.25rem 0.5rem', flexWrap: 'wrap' }}>
        {registrationTypes.map((registrationType) => (
          <CategoryChip key={registrationType.value} category={registrationType} />
        ))}
      </Box>
    </>
  ) : null;
};

interface CategoryChipProps {
  category: RegistrationTypeElement;
}

export const CategoryChip = ({ category }: CategoryChipProps) => {
  const { t } = useTranslation();

  return (
    <Chip
      data-testid={dataTestId.registrationWizard.resourceType.resourceTypeChip(category.value)}
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
      label={category.text}
    />
  );
};
