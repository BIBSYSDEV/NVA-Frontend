import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
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
} from '../../types/publicationFieldNames';
import { PublicationInstanceType } from '../../types/registration.types';
import {
  RegistrationTypeElement,
  RegistrationTypesRow,
} from '../registration/resource_type_tab/components/RegistrationTypesRow';

export const CategoriesWithFiles = () => {
  const { t } = useTranslation();
  const customer = useSelector((store: RootState) => store.customer);

  const [selectedCategories, setSelectedCategories] = useState(customer?.allowFileUploadForTypes ?? []);

  const searchValue = '';

  const filterRegistrationTypes = (registrationTypes: RegistrationTypeElement[]) => {
    const lowerCaseSearchValue = searchValue.toLowerCase();
    return registrationTypes.filter((registrationType) =>
      registrationType.text.toLowerCase().includes(lowerCaseSearchValue)
    );
  };

  const onSelectType = (registrationType: PublicationInstanceType) => {
    if (selectedCategories.includes(registrationType)) {
      setSelectedCategories(selectedCategories.filter((type) => type !== registrationType));
    } else {
      setSelectedCategories([...selectedCategories, registrationType]);
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('editor.categories_with_files')}</title>
      </Helmet>
      <Typography variant="h2" gutterBottom>
        {t('editor.categories_with_files')}
      </Typography>

      <Typography sx={{ my: '2rem' }}>{t('editor.categories_with_files_description')}</Typography>

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
    </>
  );
};
