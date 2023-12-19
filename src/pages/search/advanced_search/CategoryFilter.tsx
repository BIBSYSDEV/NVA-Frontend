import { Box, FormLabel, IconButton, Paper, TextField, Typography } from '@mui/material';
import { BookType, JournalType, PublicationType, ReportType } from '../../../types/publicationFieldNames';
import { dataTestId } from '../../../utils/dataTestIds';
import {
  RegistrationTypeElement,
  RegistrationTypesRow,
} from '../../registration/resource_type_tab/components/RegistrationTypesRow';

import CloseIcon from '@mui/icons-material/Close';
import FilterVintageIcon from '@mui/icons-material/FilterVintage';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const CategoryFilter = () => {
  const { t } = useTranslation();

  const [searchValue, setSearchValue] = useState('');

  const filterRegistrationTypes = (registrationTypes: RegistrationTypeElement[]) => {
    const lowerCaseSearchValue = searchValue.toLowerCase();
    return registrationTypes.filter((registrationType) =>
      registrationType.text.toLowerCase().includes(lowerCaseSearchValue)
    );
  };

  const onChange = () => {
    console.log('onChangeType');
  };

  return (
    <Paper sx={{ p: '1rem' }} elevation={10}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <FormLabel>{t('registration.resource_type.select_resource_type')}</FormLabel>
        <IconButton
          data-testid={dataTestId.registrationWizard.resourceType.closeResourceTypeSelectorButton}
          title={t('common.close')}
          // onClick={closeSelectType}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
          my: '1rem',
        }}>
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

      <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '1rem', alignItems: 'center' }}>
        <RegistrationTypesRow
          mainType={PublicationType.PublicationInJournal}
          registrationTypes={filterRegistrationTypes(
            Object.values(JournalType).map((registrationType) => ({
              value: registrationType,
              text: t(`registration.publication_types.${registrationType}`),
            }))
          )}
          value={'currentInstanceType'}
          onChangeType={onChange}
        />
        <RegistrationTypesRow
          mainType={PublicationType.Book}
          registrationTypes={filterRegistrationTypes(
            Object.values(BookType).map((registrationType) => ({
              value: registrationType,
              text: t(`registration.publication_types.${registrationType}`),
            }))
          )}
          value={'currentInstanceType'}
          onChangeType={onChange}
        />
        <RegistrationTypesRow
          mainType={PublicationType.Report}
          registrationTypes={filterRegistrationTypes(
            Object.values(ReportType).map((registrationType) => ({
              value: registrationType,
              text: t(`registration.publication_types.${registrationType}`),
            }))
          )}
          value={'currentInstanceType'}
          onChangeType={onChange}
        />
        {/*
        <RegistrationTypesRow
          mainType={PublicationType.Degree}
          registrationTypes={filterRegistrationTypes(
            Object.values(DegreeType).map((registrationType) => ({
              value: registrationType,
              text: t(`registration.publication_types.${registrationType}`),
              disabled: isDegreeWithProtectedFiles(registrationType) && !user?.isThesisCurator,
            }))
          )}
          value={currentInstanceType}
          onChangeType={onChangeType}
        />
        <RegistrationTypesRow
          mainType={PublicationType.Anthology}
          registrationTypes={filterRegistrationTypes(
            Object.values(ChapterType).map((registrationType) => ({
              value: registrationType,
              text: t(`registration.publication_types.${registrationType}`),
            }))
          )}
          value={currentInstanceType}
          onChangeType={onChangeType}
        />
        <RegistrationTypesRow
          mainType={PublicationType.Presentation}
          registrationTypes={filterRegistrationTypes(
            Object.values(PresentationType).map((registrationType) => ({
              value: registrationType,
              text: t(`registration.publication_types.${registrationType}`),
            }))
          )}
          value={currentInstanceType}
          onChangeType={onChangeType}
        />
        <RegistrationTypesRow
          mainType={PublicationType.Artistic}
          registrationTypes={filterRegistrationTypes(
            Object.values(ArtisticType).map((registrationType) => ({
              value: registrationType,
              text: t(`registration.publication_types.${registrationType}`),
            }))
          )}
          value={currentInstanceType}
          onChangeType={onChangeType}
        />
        <RegistrationTypesRow
          mainType={PublicationType.MediaContribution}
          registrationTypes={filterRegistrationTypes(
            Object.values(MediaType).map((registrationType) => ({
              value: registrationType,
              text: t(`registration.publication_types.${registrationType}`),
            }))
          )}
          value={currentInstanceType}
          onChangeType={onChangeType}
        />
        <RegistrationTypesRow
          mainType={PublicationType.ResearchData}
          registrationTypes={filterRegistrationTypes(
            Object.values(ResearchDataType).map((registrationType) => ({
              value: registrationType,
              text: t(`registration.publication_types.${registrationType}`),
            }))
          )}
          value={currentInstanceType}
          onChangeType={onChangeType}
        />
        <RegistrationTypesRow
          mainType={PublicationType.ExhibitionContent}
          registrationTypes={filterRegistrationTypes(
            Object.values(ExhibitionContentType).map((registrationType) => ({
              value: registrationType,
              text: t(`registration.publication_types.${registrationType}`),
            }))
          )}
          value={currentInstanceType}
          onChangeType={onChangeType}
        />
        <RegistrationTypesRow
          mainType={PublicationType.GeographicalContent}
          registrationTypes={filterRegistrationTypes(
            Object.values(OtherRegistrationType).map((registrationType) => ({
              value: registrationType,
              text: t(`registration.publication_types.${registrationType}`),
            }))
          )}
          value={currentInstanceType}
          onChangeType={onChangeType}
        /> */}
      </Box>
      {/* {!currentInstanceType && (
        <FormHelperText error sx={{ mt: '1rem' }}>
          <ErrorMessage name={ResourceFieldNames.RegistrationType} />
        </FormHelperText>
      )} */}
    </Paper>
  );
};
