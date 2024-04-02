import CloseIcon from '@mui/icons-material/Close';
import FilterVintageIcon from '@mui/icons-material/FilterVintage';
import { Box, Chip, FormHelperText, FormLabel, IconButton, Paper, Typography } from '@mui/material';
import { ErrorMessage, useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { CategorySelector } from '../../../components/CategorySelector';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { RootState } from '../../../redux/store';
import { emptyArtisticPublicationInstance } from '../../../types/publication_types/artisticRegistration.types';
import { emptyBookPublicationInstance } from '../../../types/publication_types/bookRegistration.types';
import { emptyChapterPublicationInstance } from '../../../types/publication_types/chapterRegistration.types';
import { emptyDegreePublicationInstance } from '../../../types/publication_types/degreeRegistration.types';
import {
  emptyExhibitionPublicationContext,
  emptyExhibitionPublicationInstance,
} from '../../../types/publication_types/exhibitionContent.types';
import { emptyJournalPublicationInstance } from '../../../types/publication_types/journalRegistration.types';
import {
  emptyMediaContributionPeriodicalPublicationContext,
  emptyMediaContributionPeriodicalPublicationInstance,
  emptyMediaContributionPublicationContext,
  emptyMediaContributionPublicationInstance,
} from '../../../types/publication_types/mediaContributionRegistration.types';
import {
  emptyMapPublicationContext,
  emptyMapPublicationInstance,
} from '../../../types/publication_types/otherRegistration.types';
import {
  emptyPresentationPublicationContext,
  emptyPresentationPublicationInstance,
} from '../../../types/publication_types/presentationRegistration.types';
import { emptyReportPublicationInstance } from '../../../types/publication_types/reportRegistration.types';
import {
  emptyResearchDataPublicationContext,
  emptyResearchDataPublicationInstance,
} from '../../../types/publication_types/researchDataRegistration.types';
import {
  contextTypeBaseFieldName,
  instanceTypeBaseFieldName,
  PublicationType,
  ResearchDataType,
  ResourceFieldNames,
} from '../../../types/publicationFieldNames';
import { PublicationChannelType, PublicationInstanceType, Registration } from '../../../types/registration.types';
import { dataTestId } from '../../../utils/dataTestIds';
import {
  getDisabledCategories,
  getMainRegistrationType,
  isPeriodicalMediaContribution,
  nviApplicableTypes,
} from '../../../utils/registration-helpers';

export const SelectRegistrationTypeField = () => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const customer = useSelector((store: RootState) => store.customer);
  const { values, setFieldValue, validateForm } = useFormikContext<Registration>();
  const currentInstanceType = values.entityDescription?.reference?.publicationInstance?.type ?? '';

  const [openSelectType, setOpenSelectType] = useState(!currentInstanceType);
  const [confirmNewType, setConfirmNewType] = useState<PublicationInstanceType | ''>('');
  const [showDatasetConditions, setShowDatasetConditions] = useState(false);

  const closeSelectType = () => setOpenSelectType(false);

  const updateRegistrationData = (newInstanceType: PublicationInstanceType) => {
    if (newInstanceType !== currentInstanceType) {
      const newContextType = getMainRegistrationType(newInstanceType);
      const newMainType = newContextType !== values.entityDescription?.reference?.publicationContext?.type;
      switch (newContextType) {
        case PublicationType.PublicationInJournal:
          newMainType &&
            setFieldValue(contextTypeBaseFieldName, { type: PublicationChannelType.UnconfirmedJournal }, false);
          setFieldValue(
            instanceTypeBaseFieldName,
            { ...emptyJournalPublicationInstance, type: newInstanceType },
            false
          );
          break;
        case PublicationType.Book:
          newMainType &&
            setFieldValue(
              contextTypeBaseFieldName,
              {
                type: PublicationType.Book,
                publisher: { type: PublicationChannelType.UnconfirmedPublisher },
                series: { type: PublicationChannelType.UnconfirmedSeries },
              },
              false
            );
          setFieldValue(instanceTypeBaseFieldName, { ...emptyBookPublicationInstance, type: newInstanceType }, false);
          break;
        case PublicationType.Report:
          newMainType &&
            setFieldValue(
              contextTypeBaseFieldName,
              {
                type: PublicationType.Report,
                publisher: { type: PublicationChannelType.UnconfirmedPublisher },
                series: { type: PublicationChannelType.UnconfirmedSeries },
              },
              false
            );
          setFieldValue(instanceTypeBaseFieldName, { ...emptyReportPublicationInstance, type: newInstanceType }, false);
          break;
        case PublicationType.Degree:
          newMainType &&
            setFieldValue(
              contextTypeBaseFieldName,
              {
                type: PublicationType.Degree,
                publisher: { type: PublicationChannelType.UnconfirmedPublisher },
                series: { type: PublicationChannelType.UnconfirmedSeries },
                course: { type: 'UnconfirmedCourse', code: '' },
              },
              false
            );
          setFieldValue(instanceTypeBaseFieldName, { ...emptyDegreePublicationInstance, type: newInstanceType }, false);
          break;
        case PublicationType.Anthology:
          newMainType && setFieldValue(contextTypeBaseFieldName, { type: PublicationType.Anthology }, false);
          setFieldValue(
            instanceTypeBaseFieldName,
            { ...emptyChapterPublicationInstance, type: newInstanceType },
            false
          );
          break;
        case PublicationType.Presentation:
          newMainType && setFieldValue(contextTypeBaseFieldName, emptyPresentationPublicationContext, false);
          setFieldValue(
            instanceTypeBaseFieldName,
            { ...emptyPresentationPublicationInstance, type: newInstanceType },
            false
          );
          break;
        case PublicationType.Artistic:
          newMainType && setFieldValue(contextTypeBaseFieldName, { type: PublicationType.Artistic, venues: [] }, false);
          setFieldValue(
            instanceTypeBaseFieldName,
            { ...emptyArtisticPublicationInstance, type: newInstanceType },
            false
          );
          break;
        case PublicationType.MediaContribution:
          if (isPeriodicalMediaContribution(newInstanceType)) {
            setFieldValue(contextTypeBaseFieldName, emptyMediaContributionPeriodicalPublicationContext, false);
            if (!isPeriodicalMediaContribution(currentInstanceType)) {
              setFieldValue(
                instanceTypeBaseFieldName,
                {
                  ...emptyMediaContributionPeriodicalPublicationInstance,
                  type: newInstanceType,
                },
                false
              );
            } else {
              setFieldValue(ResourceFieldNames.RegistrationType, newInstanceType, false);
            }
          } else {
            setFieldValue(contextTypeBaseFieldName, emptyMediaContributionPublicationContext, false);
            if (isPeriodicalMediaContribution(currentInstanceType)) {
              setFieldValue(
                instanceTypeBaseFieldName,
                {
                  ...emptyMediaContributionPublicationInstance,
                  type: newInstanceType,
                },
                false
              );
            } else {
              setFieldValue(ResourceFieldNames.RegistrationType, newInstanceType, false);
            }
          }
          break;
        case PublicationType.ResearchData:
          newMainType && setFieldValue(contextTypeBaseFieldName, emptyResearchDataPublicationContext, false);
          setFieldValue(
            instanceTypeBaseFieldName,
            { ...emptyResearchDataPublicationInstance, type: newInstanceType },
            false
          );
          break;
        case PublicationType.ExhibitionContent:
          newMainType && setFieldValue(contextTypeBaseFieldName, emptyExhibitionPublicationContext, false);
          setFieldValue(instanceTypeBaseFieldName, emptyExhibitionPublicationInstance, false);
          break;
        case PublicationType.GeographicalContent:
          newMainType && setFieldValue(contextTypeBaseFieldName, emptyMapPublicationContext, false);
          setFieldValue(instanceTypeBaseFieldName, { ...emptyMapPublicationInstance, type: newInstanceType }, false);
          break;
      }
      validateForm();
    }
  };

  const onChangeType = (newInstanceType: PublicationInstanceType) => {
    if (currentInstanceType) {
      if (newInstanceType !== currentInstanceType) {
        setConfirmNewType(newInstanceType);
      } else {
        closeSelectType();
      }
    } else {
      if (newInstanceType === ResearchDataType.Dataset) {
        // User must confirm that the dataset does not include any sensitive data
        setShowDatasetConditions(true);
      } else {
        updateRegistrationData(newInstanceType);
        closeSelectType();
      }
    }
  };

  const disabledCategories = getDisabledCategories(user, customer, values, t);

  return openSelectType || !currentInstanceType ? (
    <>
      <Paper sx={{ p: '1rem' }} elevation={10}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <FormLabel>{t('registration.resource_type.select_resource_type')}</FormLabel>
          {currentInstanceType && (
            <IconButton
              data-testid={dataTestId.registrationWizard.resourceType.closeResourceTypeSelectorButton}
              title={t('common.close')}
              onClick={closeSelectType}>
              <CloseIcon />
            </IconButton>
          )}
        </Box>

        <CategorySelector
          enableNviHighLightning={true}
          selectedCategories={currentInstanceType ? [currentInstanceType] : []}
          onCategoryClick={onChangeType}
          disabledCategories={disabledCategories}
        />

        {!currentInstanceType && (
          <FormHelperText error sx={{ mt: '1rem' }}>
            <ErrorMessage name={ResourceFieldNames.RegistrationType} />
          </FormHelperText>
        )}
      </Paper>
      <ConfirmDialog
        open={!!confirmNewType}
        title={t('registration.resource_type.change_registration_type')}
        onAccept={() => {
          if (confirmNewType && confirmNewType !== values.entityDescription?.reference?.publicationInstance?.type) {
            if (confirmNewType === ResearchDataType.Dataset) {
              setShowDatasetConditions(true);
            } else {
              updateRegistrationData(confirmNewType);
              closeSelectType();
            }
          }

          setConfirmNewType('');
        }}
        onCancel={() => {
          setConfirmNewType('');
        }}>
        {t('registration.resource_type.change_registration_type_description')}
      </ConfirmDialog>

      <ConfirmDialog
        open={
          showDatasetConditions ||
          (values.entityDescription?.reference?.publicationInstance?.type === ResearchDataType.Dataset &&
            !values.entityDescription.reference.publicationInstance.userAgreesToTermsAndConditions)
        }
        title={t('registration.resource_type.research_data.accept_dataset_terms.dialog_title')}
        onAccept={() => {
          setConfirmNewType('');
          setShowDatasetConditions(false);
        }}
        ignoreBackdropClick // Force user to click Yes or No
        onCancel={() => {
          updateRegistrationData(ResearchDataType.Dataset);
          setShowDatasetConditions(false);
          setFieldValue(ResourceFieldNames.PublicationInstanceAgreeTerms, true, false); // Set validation to false to avoid Form and Type fields shown as errors
          closeSelectType();
        }}
        dialogDataTestId={dataTestId.registrationWizard.resourceType.confirmDatasetTypeDialog}>
        <Typography fontWeight={500}>
          {t('registration.resource_type.research_data.accept_dataset_terms.contains_personal_data')}
        </Typography>
        <Typography paragraph>
          {t('registration.resource_type.research_data.accept_dataset_terms.contains_personal_data_description')}
        </Typography>

        <Typography fontWeight={500}>
          {t('registration.resource_type.research_data.accept_dataset_terms.contains_sensitive_data')}
        </Typography>
        <Typography paragraph>
          {t('registration.resource_type.research_data.accept_dataset_terms.contains_sensitive_data_description')}
        </Typography>

        <Typography>{t('registration.resource_type.research_data.accept_dataset_terms.further_info')}</Typography>
      </ConfirmDialog>
    </>
  ) : (
    <div>
      <FormLabel sx={{ display: 'block' }}>{t('registration.resource_type.resource_type')}</FormLabel>
      <Chip
        data-testid={dataTestId.registrationWizard.resourceType.resourceTypeChip(currentInstanceType)}
        icon={
          nviApplicableTypes.includes(currentInstanceType) ? (
            <FilterVintageIcon
              titleAccess={t('registration.resource_type.nvi.can_give_publication_points')}
              fontSize="small"
            />
          ) : undefined
        }
        variant="filled"
        color="primary"
        label={t(`registration.publication_types.${currentInstanceType}`)}
        onClick={() => setOpenSelectType(true)}
        sx={{ mt: '0.5rem', width: 'max-content' }}
      />
      <FormHelperText>{t('registration.resource_type.click_to_change_resource_type')}</FormHelperText>
    </div>
  );
};
