import { FormikErrors, FormikTouched, useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MenuItem, TextField } from '@mui/material';
import { InputContainerBox, StyledSelectWrapper } from '../../components/styled/Wrappers';
import { emptyBookPublicationInstance } from '../../types/publication_types/bookRegistration.types';
import { emptyChapterPublicationInstance } from '../../types/publication_types/chapterRegistration.types';
import { emptyDegreePublicationInstance } from '../../types/publication_types/degreeRegistration.types';
import {
  emptyJournalPublicationInstance,
  JournalPublicationInstance,
  JournalReference,
} from '../../types/publication_types/journalRegistration.types';
import { emptyReportPublicationInstance } from '../../types/publication_types/reportRegistration.types';
import {
  contextTypeBaseFieldName,
  instanceTypeBaseFieldName,
  PublicationType,
  ResourceFieldNames,
} from '../../types/publicationFieldNames';
import { EntityDescription, PublicationChannelType, Registration } from '../../types/registration.types';
import { BookTypeForm } from './resource_type_tab/BookTypeForm';
import { ChapterTypeForm } from './resource_type_tab/ChapterTypeForm';
import { DegreeTypeForm } from './resource_type_tab/DegreeTypeForm';
import { JournalTypeForm } from './resource_type_tab/JournalTypeForm';
import { ReportTypeForm } from './resource_type_tab/ReportTypeForm';
import { getMainRegistrationType, isArtistic, isChapter } from '../../utils/registration-helpers';
import { PresentationTypeForm } from './resource_type_tab/PresentationTypeForm';
import {
  emptyPresentationPublicationContext,
  emptyPresentationPublicationInstance,
} from '../../types/publication_types/presentationRegistration.types';
import { ArtisticTypeForm } from './resource_type_tab/ArtisticTypeForm';
import { emptyArtisticPublicationInstance } from '../../types/publication_types/artisticRegistration.types';
import { MediaTypeForm } from './resource_type_tab/MediaTypeForm';
import {
  emptyMediaContributionPublicationContext,
  emptyMediaContributionPublicationInstance,
} from '../../types/publication_types/mediaContributionRegistration';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { ResearchDataTypeForm } from './resource_type_tab/ResearchDataTypeForm';
import {
  emptyResearchDataPublicationInstance,
  emptyResearchDataPublicationContext,
} from '../../types/publication_types/researchDataRegistration.types';

export const ResourceTypePanel = () => {
  const { t } = useTranslation();
  const { values, setTouched, setFieldValue, touched, errors } = useFormikContext<Registration>();
  const instanceType = values.entityDescription?.reference?.publicationInstance.type ?? '';
  const [mainType, setMainType] = useState(getMainRegistrationType(instanceType));

  const [confirmContextType, setConfirmContextType] = useState('');
  const [confirmInstanceType, setConfirmInstanceType] = useState('');

  const setPublicationContextType = (newContextType: string) => {
    // Ensure some values are reset when publication type changes
    setMainType(newContextType);

    switch (newContextType) {
      case PublicationType.PublicationInJournal:
        setFieldValue(instanceTypeBaseFieldName, emptyJournalPublicationInstance, false);
        setFieldValue(contextTypeBaseFieldName, { type: PublicationChannelType.UnconfirmedJournal }, false);
        break;
      case PublicationType.Book:
        setFieldValue(instanceTypeBaseFieldName, emptyBookPublicationInstance, false);
        setFieldValue(
          contextTypeBaseFieldName,
          {
            type: PublicationType.Book,
            publisher: { type: PublicationChannelType.UnconfirmedPublisher },
            series: { type: PublicationChannelType.UnconfirmedSeries },
          },
          false
        );
        break;
      case PublicationType.Report:
        setFieldValue(instanceTypeBaseFieldName, emptyReportPublicationInstance, false);
        setFieldValue(
          contextTypeBaseFieldName,
          {
            type: PublicationType.Report,
            publisher: { type: PublicationChannelType.UnconfirmedPublisher },
            series: { type: PublicationChannelType.UnconfirmedSeries },
          },
          false
        );
        break;
      case PublicationType.Degree:
        setFieldValue(instanceTypeBaseFieldName, emptyDegreePublicationInstance, false);
        setFieldValue(
          contextTypeBaseFieldName,
          {
            type: PublicationType.Degree,
            publisher: { type: PublicationChannelType.UnconfirmedPublisher },
            series: { type: PublicationChannelType.UnconfirmedSeries },
          },
          false
        );
        break;
      case PublicationType.Chapter:
        setFieldValue(instanceTypeBaseFieldName, emptyChapterPublicationInstance, false);
        setFieldValue(contextTypeBaseFieldName, { type: PublicationType.Chapter }, false);
        break;
      case PublicationType.Presentation:
        setFieldValue(instanceTypeBaseFieldName, emptyPresentationPublicationInstance, false);
        setFieldValue(contextTypeBaseFieldName, emptyPresentationPublicationContext, false);
        break;
      case PublicationType.Artistic:
        setFieldValue(instanceTypeBaseFieldName, emptyArtisticPublicationInstance, false);
        setFieldValue(contextTypeBaseFieldName, { type: PublicationType.Artistic, venues: [] }, false);
        break;
      case PublicationType.MediaContribution:
        setFieldValue(instanceTypeBaseFieldName, emptyMediaContributionPublicationInstance, false);
        setFieldValue(contextTypeBaseFieldName, emptyMediaContributionPublicationContext, false);
        break;
      case PublicationType.ResearchData:
        setFieldValue(instanceTypeBaseFieldName, emptyResearchDataPublicationInstance, false);
        setFieldValue(contextTypeBaseFieldName, emptyResearchDataPublicationContext, false);
        break;
    }

    // Avoid showing potential errors instantly
    const newTouched = touched;
    (newTouched.entityDescription as FormikTouched<EntityDescription>).npiSubjectHeading = false;
    (newTouched.entityDescription as FormikTouched<EntityDescription>).reference = false;

    setTouched(newTouched);
  };

  const setPublicationInstanceType = (newInstanceType: string) => {
    const commonValues = {
      type: newInstanceType,
      contentType: null,
      peerReviewed: null,
    };
    const newValues = values.entityDescription?.reference
      ? {
          ...values.entityDescription.reference.publicationInstance,
          ...commonValues,
        }
      : commonValues;

    setFieldValue(instanceTypeBaseFieldName, newValues);

    if (isChapter(newInstanceType)) {
      // Reset partOf when user changes subtype of Chapter, since previous container might not be valid for the new type
      setFieldValue(ResourceFieldNames.PartOf, undefined);
    } else if (isArtistic(newInstanceType)) {
      setFieldValue(instanceTypeBaseFieldName, { ...emptyArtisticPublicationInstance, type: newInstanceType });
    }
  };

  const referenceErrors = (errors.entityDescription as FormikErrors<EntityDescription>)
    ?.reference as FormikErrors<JournalReference>;
  const referenceTouched = (touched.entityDescription as FormikTouched<EntityDescription>)
    ?.reference as FormikTouched<JournalReference>;

  // Handle error for nullable reference as well as reference with missing type
  const typeError =
    (referenceErrors?.publicationInstance as FormikErrors<JournalPublicationInstance>)?.type ??
    (typeof referenceErrors === 'string' && referenceErrors) ??
    '';
  const typeTouched = (referenceTouched?.publicationInstance as FormikTouched<JournalPublicationInstance>)?.type;

  return (
    <InputContainerBox>
      <StyledSelectWrapper>
        <TextField
          data-testid="publication-context-type"
          select
          variant="filled"
          fullWidth
          label={t('registration.resource_type.form')}
          required
          value={mainType}
          error={!!typeError && typeTouched}
          helperText={!!typeError && typeTouched ? typeError : ''}
          onChange={(event) =>
            mainType ? setConfirmContextType(event.target.value) : setPublicationContextType(event.target.value)
          }>
          {Object.values(PublicationType).map((typeValue) => (
            <MenuItem value={typeValue} key={typeValue} data-testid={`publication-context-type-${typeValue}`}>
              {t(`registration.publication_types.${typeValue}`)}
            </MenuItem>
          ))}
        </TextField>
      </StyledSelectWrapper>

      {mainType === PublicationType.PublicationInJournal ? (
        <JournalTypeForm onChangeSubType={instanceType ? setConfirmInstanceType : setPublicationInstanceType} />
      ) : mainType === PublicationType.Book ? (
        <BookTypeForm onChangeSubType={instanceType ? setConfirmInstanceType : setPublicationInstanceType} />
      ) : mainType === PublicationType.Report ? (
        <ReportTypeForm onChangeSubType={instanceType ? setConfirmInstanceType : setPublicationInstanceType} />
      ) : mainType === PublicationType.Degree ? (
        <DegreeTypeForm onChangeSubType={instanceType ? setConfirmInstanceType : setPublicationInstanceType} />
      ) : mainType === PublicationType.Chapter ? (
        <ChapterTypeForm onChangeSubType={instanceType ? setConfirmInstanceType : setPublicationInstanceType} />
      ) : mainType === PublicationType.Presentation ? (
        <PresentationTypeForm onChangeSubType={instanceType ? setConfirmInstanceType : setPublicationInstanceType} />
      ) : mainType === PublicationType.Artistic ? (
        <ArtisticTypeForm onChangeSubType={instanceType ? setConfirmInstanceType : setPublicationInstanceType} />
      ) : mainType === PublicationType.MediaContribution ? (
        <MediaTypeForm onChangeSubType={instanceType ? setConfirmInstanceType : setPublicationInstanceType} />
      ) : mainType === PublicationType.ResearchData ? (
        <ResearchDataTypeForm onChangeSubType={instanceType ? setConfirmInstanceType : setPublicationInstanceType} />
      ) : null}

      <ConfirmDialog
        open={!!confirmContextType || !!confirmInstanceType}
        title={t('registration.resource_type.change_registration_type')}
        onAccept={() => {
          if (confirmContextType) {
            setPublicationContextType(confirmContextType);
            setConfirmContextType('');
          } else if (confirmInstanceType) {
            setPublicationInstanceType(confirmInstanceType);
            setConfirmInstanceType('');
          }
        }}
        onCancel={() => {
          setConfirmContextType('');
          setConfirmInstanceType('');
        }}>
        {t('registration.resource_type.change_registration_type_description')}
      </ConfirmDialog>
    </InputContainerBox>
  );
};
