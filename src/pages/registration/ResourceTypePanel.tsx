import { ErrorMessage, useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormHelperText, Typography } from '@mui/material';
import { InputContainerBox } from '../../components/styled/Wrappers';
import { emptyBookPublicationInstance } from '../../types/publication_types/bookRegistration.types';
import { emptyChapterPublicationInstance } from '../../types/publication_types/chapterRegistration.types';
import { emptyDegreePublicationInstance } from '../../types/publication_types/degreeRegistration.types';
import { emptyJournalPublicationInstance } from '../../types/publication_types/journalRegistration.types';
import { emptyReportPublicationInstance } from '../../types/publication_types/reportRegistration.types';
import {
  contextTypeBaseFieldName,
  instanceTypeBaseFieldName,
  PublicationType,
  ResearchDataType,
  ResourceFieldNames,
} from '../../types/publicationFieldNames';
import { PublicationChannelType, PublicationInstanceType, Registration } from '../../types/registration.types';
import { BookTypeForm } from './resource_type_tab/BookTypeForm';
import { ChapterTypeForm } from './resource_type_tab/ChapterTypeForm';
import { DegreeTypeForm } from './resource_type_tab/DegreeTypeForm';
import { JournalTypeForm } from './resource_type_tab/JournalTypeForm';
import { ReportTypeForm } from './resource_type_tab/ReportTypeForm';
import { getMainRegistrationType, isPeriodicalMediaContribution } from '../../utils/registration-helpers';
import { PresentationTypeForm } from './resource_type_tab/PresentationTypeForm';
import {
  emptyPresentationPublicationContext,
  emptyPresentationPublicationInstance,
} from '../../types/publication_types/presentationRegistration.types';
import { ArtisticTypeForm } from './resource_type_tab/ArtisticTypeForm';
import { emptyArtisticPublicationInstance } from '../../types/publication_types/artisticRegistration.types';
import {
  emptyMediaContributionPeriodicalPublicationContext,
  emptyMediaContributionPeriodicalPublicationInstance,
  emptyMediaContributionPublicationContext,
  emptyMediaContributionPublicationInstance,
} from '../../types/publication_types/mediaContributionRegistration.types';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { ResearchDataTypeForm } from './resource_type_tab/ResearchDataTypeForm';
import {
  emptyResearchDataPublicationInstance,
  emptyResearchDataPublicationContext,
} from '../../types/publication_types/researchDataRegistration.types';
import { MediaTypeForm } from './resource_type_tab/sub_type_forms/media_types/MediaTypeForm';
import {
  emptyMapPublicationContext,
  emptyMapPublicationInstance,
} from '../../types/publication_types/otherRegistration.types';
import { OtherTypeForm } from './resource_type_tab/OtherTypeForm';
import { SelectRegistrationType } from './resource_type_tab/SelectRegistrationType';

export const ResourceTypePanel = () => {
  const { t } = useTranslation();
  const { values, setFieldValue } = useFormikContext<Registration>();
  const instanceType = values.entityDescription?.reference?.publicationInstance.type ?? '';
  const mainType = getMainRegistrationType(instanceType);

  const [confirmNewType, setConfirmNewType] = useState('');
  const [showDatasetConditions, setShowDatasetConditions] = useState(false);

  const updatePublicationInstance = (newInstanceType: string) => {
    const newContextType = getMainRegistrationType(newInstanceType);
    const newMainType = newContextType !== values.entityDescription?.reference?.publicationContext?.type;

    if (newInstanceType !== instanceType) {
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
            newMainType && setFieldValue(contextTypeBaseFieldName, emptyMediaContributionPublicationContext, false);
            setFieldValue(
              instanceTypeBaseFieldName,
              {
                ...emptyMediaContributionPublicationInstance,
                type: newInstanceType,
              },
              false
            );
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
    }
  };

  const onChangeType = (newInstanceType: PublicationInstanceType) => {
    if (instanceType) {
      if (newInstanceType !== instanceType) {
        setConfirmNewType(newInstanceType);
      }
    } else {
      if (newInstanceType === ResearchDataType.Dataset) {
        // User must confirm that the dataset does not include any sensitive data
        setShowDatasetConditions(true);
      } else {
        updatePublicationInstance(newInstanceType);
      }
    }
  };

  return (
    <InputContainerBox>
      <SelectRegistrationType onChangeType={onChangeType} />
      <FormHelperText error>
        <ErrorMessage name={ResourceFieldNames.SubType} />
      </FormHelperText>

      {mainType === PublicationType.PublicationInJournal ? (
        <JournalTypeForm />
      ) : mainType === PublicationType.Book ? (
        <BookTypeForm />
      ) : mainType === PublicationType.Report ? (
        <ReportTypeForm />
      ) : mainType === PublicationType.Degree ? (
        <DegreeTypeForm />
      ) : mainType === PublicationType.Chapter ? (
        <ChapterTypeForm />
      ) : mainType === PublicationType.Presentation ? (
        <PresentationTypeForm />
      ) : mainType === PublicationType.Artistic ? (
        <ArtisticTypeForm />
      ) : mainType === PublicationType.MediaContribution ? (
        <MediaTypeForm />
      ) : mainType === PublicationType.ResearchData ? (
        <ResearchDataTypeForm />
      ) : mainType === PublicationType.GeographicalContent ? (
        <OtherTypeForm />
      ) : null}

      <ConfirmDialog
        open={!!confirmNewType}
        title={t('registration.resource_type.change_registration_type')}
        onAccept={() => {
          if (confirmNewType !== values.entityDescription?.reference?.publicationInstance.type) {
            if (confirmNewType === ResearchDataType.Dataset) {
              setShowDatasetConditions(true);
            } else {
              updatePublicationInstance(confirmNewType);
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
    </InputContainerBox>
  );
};
