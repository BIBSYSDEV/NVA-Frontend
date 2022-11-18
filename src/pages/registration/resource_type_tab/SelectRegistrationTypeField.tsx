import { Box, Chip, FormHelperText, FormLabel, IconButton, Paper, Typography } from '@mui/material';
import { ErrorMessage, useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import {
  ArtisticType,
  BookType,
  ChapterType,
  contextTypeBaseFieldName,
  DegreeType,
  instanceTypeBaseFieldName,
  JournalType,
  MediaType,
  OtherRegistrationType,
  PresentationType,
  PublicationType,
  ReportType,
  ResearchDataType,
  ResourceFieldNames,
} from '../../../types/publicationFieldNames';
import { emptyArtisticPublicationInstance } from '../../../types/publication_types/artisticRegistration.types';
import { emptyBookPublicationInstance } from '../../../types/publication_types/bookRegistration.types';
import { emptyChapterPublicationInstance } from '../../../types/publication_types/chapterRegistration.types';
import { emptyDegreePublicationInstance } from '../../../types/publication_types/degreeRegistration.types';
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
import { PublicationChannelType, PublicationInstanceType, Registration } from '../../../types/registration.types';
import { getMainRegistrationType, isPeriodicalMediaContribution } from '../../../utils/registration-helpers';
import { dataTestId } from '../../../utils/dataTestIds';

export const SelectRegistrationTypeField = () => {
  const { t } = useTranslation();
  const { values, setFieldValue, validateForm } = useFormikContext<Registration>();
  const currentInstanceType = values.entityDescription?.reference?.publicationInstance.type ?? '';

  const [openSelectType, setOpenSelectType] = useState(!currentInstanceType);
  const [confirmNewType, setConfirmNewType] = useState('');
  const [showDatasetConditions, setShowDatasetConditions] = useState(false);

  const updatePublicationInstance = (newInstanceType: string) => {
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
              },
              false
            );
          setFieldValue(instanceTypeBaseFieldName, { ...emptyDegreePublicationInstance, type: newInstanceType }, false);
          break;
        case PublicationType.Chapter:
          newMainType && setFieldValue(contextTypeBaseFieldName, { type: PublicationType.Chapter }, false);
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
            if (!isPeriodicalMediaContribution(currentInstanceType)) {
              setFieldValue(contextTypeBaseFieldName, emptyMediaContributionPeriodicalPublicationContext, false);
              setFieldValue(
                instanceTypeBaseFieldName,
                {
                  ...emptyMediaContributionPeriodicalPublicationInstance,
                  type: newInstanceType,
                },
                false
              );
            } else {
              setFieldValue(ResourceFieldNames.SubType, newInstanceType, false);
            }
          } else {
            if (isPeriodicalMediaContribution(currentInstanceType)) {
              setFieldValue(contextTypeBaseFieldName, emptyMediaContributionPublicationContext, false);
              setFieldValue(
                instanceTypeBaseFieldName,
                {
                  ...emptyMediaContributionPublicationInstance,
                  type: newInstanceType,
                },
                false
              );
            } else {
              setFieldValue(ResourceFieldNames.SubType, newInstanceType, false);
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
        setOpenSelectType(false);
      }
    } else {
      if (newInstanceType === ResearchDataType.Dataset) {
        // User must confirm that the dataset does not include any sensitive data
        setShowDatasetConditions(true);
      } else {
        updatePublicationInstance(newInstanceType);
        setOpenSelectType(false);
      }
    }
  };

  return openSelectType || !currentInstanceType ? (
    <>
      <Paper sx={{ p: '1rem' }} elevation={10}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <FormLabel>{t('registration.resource_type.select_resource_type')}</FormLabel>

          {currentInstanceType && (
            <IconButton
              data-testid={dataTestId.registrationWizard.resourceType.closeResourceTypeSelectorButton}
              title={t('common.close')}
              onClick={() => setOpenSelectType(false)}>
              <CloseIcon />
            </IconButton>
          )}
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '1rem', alignItems: 'center' }}>
          <TypeRow
            mainType={PublicationType.PublicationInJournal}
            subTypes={Object.values(JournalType)}
            value={currentInstanceType}
            onChangeType={onChangeType}
          />
          <TypeRow
            mainType={PublicationType.Book}
            subTypes={Object.values(BookType)}
            value={currentInstanceType}
            onChangeType={onChangeType}
          />
          <TypeRow
            mainType={PublicationType.Report}
            subTypes={Object.values(ReportType)}
            value={currentInstanceType}
            onChangeType={onChangeType}
          />
          <TypeRow
            mainType={PublicationType.Degree}
            subTypes={Object.values(DegreeType)}
            value={currentInstanceType}
            onChangeType={onChangeType}
          />
          <TypeRow
            mainType={PublicationType.Chapter}
            subTypes={Object.values(ChapterType)}
            value={currentInstanceType}
            onChangeType={onChangeType}
          />
          <TypeRow
            mainType={PublicationType.Presentation}
            subTypes={Object.values(PresentationType)}
            value={currentInstanceType}
            onChangeType={onChangeType}
          />
          <TypeRow
            mainType={PublicationType.Artistic}
            subTypes={Object.values(ArtisticType)}
            value={currentInstanceType}
            onChangeType={onChangeType}
          />
          <TypeRow
            mainType={PublicationType.MediaContribution}
            subTypes={Object.values(MediaType)}
            value={currentInstanceType}
            onChangeType={onChangeType}
          />
          <TypeRow
            mainType={PublicationType.ResearchData}
            subTypes={Object.values(ResearchDataType)}
            value={currentInstanceType}
            onChangeType={onChangeType}
          />
          <TypeRow
            mainType={PublicationType.GeographicalContent}
            subTypes={Object.values(OtherRegistrationType)}
            value={currentInstanceType}
            onChangeType={onChangeType}
          />
        </Box>
        {!currentInstanceType && (
          <FormHelperText error sx={{ mt: '1rem' }}>
            <ErrorMessage name={ResourceFieldNames.SubType} />
          </FormHelperText>
        )}
      </Paper>
      <ConfirmDialog
        open={!!confirmNewType}
        title={t('registration.resource_type.change_registration_type')}
        onAccept={() => {
          if (confirmNewType !== values.entityDescription?.reference?.publicationInstance.type) {
            if (confirmNewType === ResearchDataType.Dataset) {
              setShowDatasetConditions(true);
            } else {
              updatePublicationInstance(confirmNewType);
              setOpenSelectType(false);
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
          (values.entityDescription?.reference?.publicationInstance.type === ResearchDataType.Dataset &&
            !values.entityDescription.reference.publicationInstance.userAgreesToTermsAndConditions)
        }
        title={t('registration.resource_type.research_data.accept_dataset_terms.dialog_title')}
        onAccept={() => {
          setConfirmNewType('');
          setShowDatasetConditions(false);
        }}
        ignoreBackdropClick // Force user to click Yes or No
        onCancel={() => {
          updatePublicationInstance(ResearchDataType.Dataset);
          setShowDatasetConditions(false);
          setFieldValue(ResourceFieldNames.PublicationInstanceAgreeTerms, true, false); // Set validation to false to avoid Form and Type fields shown as errors
          setOpenSelectType(false);
        }}
        dialogDataTestId="research-data-confirm-dialog">
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
      <FormLabel>{t('registration.resource_type.resource_type')}</FormLabel>
      <Chip
        data-testid={dataTestId.registrationWizard.resourceType.resourceTypeChip(currentInstanceType)}
        variant="filled"
        color="primary"
        label={t(`registration.publication_types.${currentInstanceType}`)}
        onClick={() => setOpenSelectType(!openSelectType)}
        sx={{ display: 'block', mt: '0.5rem', width: 'max-content' }}
      />
      <FormHelperText>{t('registration.resource_type.click_to_change_resource_type')}</FormHelperText>
    </div>
  );
};

interface TypeRowProps {
  onChangeType: (type: PublicationInstanceType) => void;
  mainType: PublicationType;
  subTypes: PublicationInstanceType[];
  value: string;
}

export const TypeRow = ({ mainType, subTypes, value, onChangeType }: TypeRowProps) => {
  const { t } = useTranslation();

  return (
    <>
      <Typography>{t(`registration.publication_types.${mainType}`)}</Typography>
      <Box sx={{ display: 'flex', gap: '0.5rem' }}>
        {subTypes.map((subType) => (
          <Chip
            data-testid={dataTestId.registrationWizard.resourceType.resourceTypeChip(subType)}
            key={subType}
            variant={value === subType ? 'filled' : 'outlined'}
            color="primary"
            onClick={() => onChangeType(subType)}
            label={t(`registration.publication_types.${subType}`)}
          />
        ))}
      </Box>
    </>
  );
};
