import { useFormikContext } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MenuItem, TextField } from '@material-ui/core';
import { BackgroundDiv } from '../../components/BackgroundDiv';
import { StyledSelectWrapper } from '../../components/styled/Wrappers';
import { lightTheme } from '../../themes/lightTheme';
import { emptyBookPublicationInstance } from '../../types/publication_types/bookRegistration.types';
import { emptyChapterPublicationInstance } from '../../types/publication_types/chapterRegistration.types';
import { emptyDegreePublicationInstance } from '../../types/publication_types/degreeRegistration.types';
import { emptyJournalPublicationInstance } from '../../types/publication_types/journalRegistration.types';
import { emptyReportPublicationInstance } from '../../types/publication_types/reportRegistration.types';
import {
  contextTypeBaseFieldName,
  instanceTypeBaseFieldName,
  PublicationType,
} from '../../types/publicationFieldNames';
import { Registration } from '../../types/registration.types';
import { BookTypeForm } from './resource_type_tab/BookTypeForm';
import { ChapterTypeForm } from './resource_type_tab/ChapterTypeForm';
import { DegreeTypeForm } from './resource_type_tab/DegreeTypeForm';
import { JournalTypeForm } from './resource_type_tab/JournalTypeForm';
import { ReportTypeForm } from './resource_type_tab/ReportTypeForm';
import { getMainRegistrationType } from '../../utils/registration-helpers';

export const ResourceTypePanel = () => {
  const { t } = useTranslation('common');
  const { values, setTouched, setFieldValue, touched, errors } = useFormikContext<Registration>();
  const [mainType, setMainType] = useState(
    getMainRegistrationType(values.entityDescription.reference.publicationInstance.type)
  );

  const onChangeType = (newPublicationContextType: string) => {
    // Ensure some values are reset when publication type changes
    setMainType(newPublicationContextType);

    switch (newPublicationContextType) {
      case PublicationType.PublicationInJournal:
        setFieldValue(instanceTypeBaseFieldName, emptyJournalPublicationInstance, false);
        setFieldValue(contextTypeBaseFieldName, { type: 'UnconfirmedJournal' }, false);
        break;
      case PublicationType.Book:
        setFieldValue(instanceTypeBaseFieldName, emptyBookPublicationInstance, false);
        setFieldValue(contextTypeBaseFieldName, { type: 'UnconfirmedPublisher' }, false);
        break;
      case PublicationType.Report:
        setFieldValue(instanceTypeBaseFieldName, emptyReportPublicationInstance, false);
        setFieldValue(contextTypeBaseFieldName, { type: 'UnconfirmedPublisher' }, false);
        break;
      case PublicationType.Degree:
        setFieldValue(instanceTypeBaseFieldName, emptyDegreePublicationInstance, false);
        setFieldValue(contextTypeBaseFieldName, { type: 'UnconfirmedPublisher' }, false);
        break;
      case PublicationType.Chapter:
        setFieldValue(instanceTypeBaseFieldName, emptyChapterPublicationInstance, false);
        setFieldValue(contextTypeBaseFieldName, { type: 'UnconfirmedPublisher' }, false);
        break;
    }

    // Avoid showing potential errors instantly
    setTouched({
      ...touched,
      entityDescription: {
        ...touched.entityDescription,
        reference: {},
      },
    });
  };

  const onChangeSubType = (newInstanceType: string) => {
    const newValues = {
      ...values.entityDescription.reference.publicationInstance,
      type: newInstanceType,
      contentType: null,
      peerReviewed: null,
    };

    setFieldValue(instanceTypeBaseFieldName, newValues);
  };

  const typeError = errors.entityDescription?.reference?.publicationInstance?.type;
  const typeTouched = touched.entityDescription?.reference?.publicationInstance?.type;

  return (
    <>
      <BackgroundDiv backgroundColor={lightTheme.palette.section.light}>
        <StyledSelectWrapper>
          <TextField
            data-testid="publication-context-type"
            select
            variant="filled"
            fullWidth
            label={t('type')}
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
    </>
  );
};
