import { useFormikContext } from 'formik';
import React from 'react';
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
  ResourceFieldNames,
} from '../../types/publicationFieldNames';
import { Registration } from '../../types/registration.types';
import { BookTypeForm } from './resource_type_tab/BookTypeForm';
import { ChapterTypeForm } from './resource_type_tab/ChapterTypeForm';
import { SelectTypeField } from './resource_type_tab/components/SelectTypeField';
import { DegreeTypeForm } from './resource_type_tab/DegreeTypeForm';
import { JournalTypeForm } from './resource_type_tab/JournalTypeForm';
import { ReportTypeForm } from './resource_type_tab/ReportTypeForm';

export const ResourceTypePanel = () => {
  const { values, setTouched, setFieldValue, touched } = useFormikContext<Registration>();
  const publicationContextType = values.entityDescription.reference.publicationContext.type;

  const onChangeType = (newPublicationContextType: string) => {
    // Ensure some values are reset when publication type changes
    setFieldValue(contextTypeBaseFieldName, { type: newPublicationContextType }, false);

    switch (newPublicationContextType) {
      case PublicationType.PublicationInJournal:
        setFieldValue(instanceTypeBaseFieldName, emptyJournalPublicationInstance, false);
        break;
      case PublicationType.Book:
        setFieldValue(instanceTypeBaseFieldName, emptyBookPublicationInstance, false);
        break;
      case PublicationType.Report:
        setFieldValue(instanceTypeBaseFieldName, emptyReportPublicationInstance, false);
        break;
      case PublicationType.Degree:
        setFieldValue(instanceTypeBaseFieldName, emptyDegreePublicationInstance, false);
        break;
      case PublicationType.Chapter:
        setFieldValue(instanceTypeBaseFieldName, emptyChapterPublicationInstance, false);
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
      peerReviewed: undefined,
    };

    setFieldValue(instanceTypeBaseFieldName, newValues, false);
  };

  return (
    <>
      <BackgroundDiv backgroundColor={lightTheme.palette.section.light}>
        <StyledSelectWrapper>
          <SelectTypeField
            dataTestId="publication-context-type"
            fieldName={ResourceFieldNames.PubliactionContextType}
            options={Object.values(PublicationType)}
            onChangeType={onChangeType}
          />
        </StyledSelectWrapper>
      </BackgroundDiv>

      {publicationContextType && (
        <>
          {publicationContextType === PublicationType.Book && <BookTypeForm onChangeSubType={onChangeSubType} />}
          {publicationContextType === PublicationType.Report && <ReportTypeForm onChangeSubType={onChangeSubType} />}
          {publicationContextType === PublicationType.Degree && <DegreeTypeForm onChangeSubType={onChangeSubType} />}
          {publicationContextType === PublicationType.Chapter && <ChapterTypeForm onChangeSubType={onChangeSubType} />}
          {publicationContextType === PublicationType.PublicationInJournal && (
            <JournalTypeForm onChangeSubType={onChangeSubType} />
          )}
        </>
      )}
    </>
  );
};
