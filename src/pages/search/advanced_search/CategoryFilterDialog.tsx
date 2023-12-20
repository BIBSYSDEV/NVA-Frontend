import FilterVintageIcon from '@mui/icons-material/FilterVintage';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { ResultParam } from '../../../api/searchApi';
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
} from '../../../types/publicationFieldNames';
import { PublicationInstanceType } from '../../../types/registration.types';
import { dataTestId } from '../../../utils/dataTestIds';
import {
  RegistrationTypeElement,
  RegistrationTypesRow,
} from '../../registration/resource_type_tab/components/RegistrationTypesRow';

interface CategoryFilterDialogProps {
  open: boolean;
  currentCategories: PublicationInstanceType[];
  closeDialog: () => void;
}

export const CategoryFilterDialog = ({ open, currentCategories, closeDialog }: CategoryFilterDialogProps) => {
  const { t } = useTranslation();
  const history = useHistory();

  const [selectedCategories, setSelectedCategories] = useState(currentCategories);

  const [searchValue, setSearchValue] = useState('');

  const filterRegistrationTypes = (registrationTypes: RegistrationTypeElement[]) => {
    const lowerCaseSearchValue = searchValue.toLowerCase();
    return registrationTypes.filter((registrationType) =>
      registrationType.text.toLowerCase().includes(lowerCaseSearchValue)
    );
  };

  const onSelectType = (type: PublicationInstanceType) => {
    if (selectedCategories.includes(type)) {
      setSelectedCategories(selectedCategories.filter((category) => category !== type));
    } else {
      setSelectedCategories([...selectedCategories, type]);
    }
  };

  return (
    <Dialog open={open} onClose={closeDialog} maxWidth="md" fullWidth>
      <DialogTitle>{t('search.select_one_or_more_categories')}</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem',
            mb: '1rem',
          }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TextField
              data-testid={dataTestId.registrationWizard.resourceType.resourceTypeSearchField}
              sx={{ maxWidth: '17rem' }}
              type="search"
              variant="filled"
              label={t('common.search')}
              InputProps={{
                endAdornment: <SearchIcon />,
              }}
              onChange={(event) => setSearchValue(event.target.value)}
            />
            <Button variant="outlined" onClick={() => setSelectedCategories([])}>
              {t('search.reset_selection')}
            </Button>
          </Box>
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
            onChangeType={onSelectType}
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
            onChangeType={onSelectType}
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
            onChangeType={onSelectType}
          />
          <RegistrationTypesRow
            mainType={PublicationType.Degree}
            registrationTypes={filterRegistrationTypes(
              Object.values(DegreeType).map((registrationType) => ({
                value: registrationType,
                text: t(`registration.publication_types.${registrationType}`),

                selected: selectedCategories.includes(registrationType),
              }))
            )}
            onChangeType={onSelectType}
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
            onChangeType={onSelectType}
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
            onChangeType={onSelectType}
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
            onChangeType={onSelectType}
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
            onChangeType={onSelectType}
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
            onChangeType={onSelectType}
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
            onChangeType={onSelectType}
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
            onChangeType={onSelectType}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog}>{t('common.cancel')}</Button>
        <Button
          variant="outlined"
          onClick={() => {
            const params = new URLSearchParams(history.location.search);
            const newCategoryShould = selectedCategories.join(',');
            if (newCategoryShould) {
              params.set(ResultParam.CategoryShould, newCategoryShould);
            } else {
              params.delete(ResultParam.CategoryShould);
            }
            history.push({ search: params.toString() });
            closeDialog();
          }}>
          {t('common.use')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
