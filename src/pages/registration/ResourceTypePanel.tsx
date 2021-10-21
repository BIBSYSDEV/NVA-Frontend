import { FormikErrors, FormikTouched, useFormikContext } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MenuItem, TextField } from '@mui/material';
import { BackgroundDiv } from '../../components/BackgroundDiv';
import { StyledSelectWrapper } from '../../components/styled/Wrappers';
import { lightTheme } from '../../themes/lightTheme';
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
} from '../../types/publicationFieldNames';
import { EntityDescription, PublicationChannelType, Registration } from '../../types/registration.types';
import { BookTypeForm } from './resource_type_tab/BookTypeForm';
import { ChapterTypeForm } from './resource_type_tab/ChapterTypeForm';
import { DegreeTypeForm } from './resource_type_tab/DegreeTypeForm';
import { JournalTypeForm } from './resource_type_tab/JournalTypeForm';
import { ReportTypeForm } from './resource_type_tab/ReportTypeForm';
import { getMainRegistrationType } from '../../utils/registration-helpers';
import { PresentationTypeForm } from './resource_type_tab/PresentationTypeForm';
import { emptyPresentationPublicationInstance } from '../../types/publication_types/presentationRegistration.types';

export const ResourceTypePanel = () => {
  const { t } = useTranslation('registration');
  const { values, setTouched, setFieldValue, touched, errors } = useFormikContext<Registration>();
  const [mainType, setMainType] = useState(
    getMainRegistrationType(values.entityDescription?.reference?.publicationInstance.type ?? '')
  );

  const onChangeType = (newRegistrationMainType: string) => {
    // Ensure some values are reset when publication type changes
    setMainType(newRegistrationMainType);

    switch (newRegistrationMainType) {
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
        setFieldValue(
          contextTypeBaseFieldName,
          {
            type: PublicationType.Presentation,
            place: { type: 'UnconfirmedPlace' }, // TODO: find better soltion for this
            time: { type: 'TemporalExtent' },
          },
          false
        );
        break;
    }

    // Avoid showing potential errors instantly
    const newTouched = touched;
    (newTouched.entityDescription as FormikTouched<EntityDescription>).npiSubjectHeading = false;
    (newTouched.entityDescription as FormikTouched<EntityDescription>).reference = false;

    setTouched(newTouched);
  };

  const onChangeSubType = (newInstanceType: string) => {
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
    <>
      <BackgroundDiv backgroundColor={lightTheme.palette.section.light}>
        <StyledSelectWrapper>
          <TextField
            data-testid="publication-context-type"
            select
            variant="filled"
            fullWidth
            label={t('resource_type.form')}
            required
            value={mainType}
            error={!!typeError && typeTouched}
            helperText={!!typeError && typeTouched ? typeError : ''}
            onChange={(event) => onChangeType(event.target.value)}>
            {Object.values(PublicationType).map((typeValue) => (
              <MenuItem value={typeValue} key={typeValue} data-testid={`publication-context-type-${typeValue}`}>
                {t(`publicationTypes:${typeValue}`)}
              </MenuItem>
            ))}
          </TextField>
        </StyledSelectWrapper>
      </BackgroundDiv>

      {mainType === PublicationType.Book && <BookTypeForm onChangeSubType={onChangeSubType} />}
      {mainType === PublicationType.Report && <ReportTypeForm onChangeSubType={onChangeSubType} />}
      {mainType === PublicationType.Degree && <DegreeTypeForm onChangeSubType={onChangeSubType} />}
      {mainType === PublicationType.Chapter && <ChapterTypeForm onChangeSubType={onChangeSubType} />}
      {mainType === PublicationType.PublicationInJournal && <JournalTypeForm onChangeSubType={onChangeSubType} />}
      {mainType === PublicationType.Presentation && <PresentationTypeForm onChangeSubType={onChangeSubType} />}
    </>
  );
};
