import { useFormikContext } from 'formik';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import BackgroundDiv from '../../components/BackgroundDiv';
import { StyledSelectWrapper } from '../../components/styled/Wrappers';
import theme from '../../themes/mainTheme';
import { emptyBookPublicationInstance } from '../../types/publication_types/bookRegistration.types';
import { emptyChapterPublicationInstance } from '../../types/publication_types/chapterRegistration.types';
import { emptyDegreePublicationInstance } from '../../types/publication_types/degreeRegistration.types';
import { emptyJournalPublicationInstance } from '../../types/publication_types/journalRegistration.types';
import { emptyReportPublicationInstance } from '../../types/publication_types/reportRegistration.types';
import {
  contextTypeBaseFieldName,
  instanceTypeBaseFieldName,
  PublicationType,
  ReferenceFieldNames,
} from '../../types/publicationFieldNames';
import { Registration } from '../../types/registration.types';
import BookTypeForm from './references_tab/BookTypeForm';
import ChapterTypeForm from './references_tab/ChapterTypeForm';
import SelectTypeField from './references_tab/components/SelectTypeField';
import DegreeTypeForm from './references_tab/DegreeTypeForm';
import JournalTypeForm from './references_tab/JournalTypeForm';
import ReportTypeForm from './references_tab/ReportTypeForm';

const ReferencesPanel: FC = () => {
  const { t } = useTranslation('registration');
  const { values, setTouched, setFieldValue, touched } = useFormikContext<Registration>();
  const publicationContextType = values.entityDescription.reference.publicationContext.type;

  const onChangeType = (newPublicationContextType: string) => {
    // Ensure some values are reset when publication type changes
    setFieldValue(contextTypeBaseFieldName, { type: newPublicationContextType }, false);

    switch (newPublicationContextType) {
      case PublicationType.PUBLICATION_IN_JOURNAL:
        setFieldValue(instanceTypeBaseFieldName, emptyJournalPublicationInstance, false);
        break;
      case PublicationType.BOOK:
        setFieldValue(instanceTypeBaseFieldName, emptyBookPublicationInstance, false);
        break;
      case PublicationType.REPORT:
        setFieldValue(instanceTypeBaseFieldName, emptyReportPublicationInstance, false);
        break;
      case PublicationType.DEGREE:
        setFieldValue(instanceTypeBaseFieldName, emptyDegreePublicationInstance, false);
        break;
      case PublicationType.CHAPTER:
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
    setFieldValue(
      instanceTypeBaseFieldName,
      { ...values.entityDescription.reference.publicationInstance, type: newInstanceType },
      false
    );
  };

  return (
    <>
      <BackgroundDiv backgroundColor={theme.palette.section.light}>
        <StyledSelectWrapper>
          <SelectTypeField
            dataTestId="publication-context-type"
            fieldName={ReferenceFieldNames.PUBLICATION_CONTEXT_TYPE}
            options={Object.values(PublicationType)}
            onChangeType={onChangeType}
          />
        </StyledSelectWrapper>
      </BackgroundDiv>

      {publicationContextType && (
        <>
          {publicationContextType === PublicationType.BOOK && <BookTypeForm onChangeSubType={onChangeSubType} />}
          {publicationContextType === PublicationType.REPORT && <ReportTypeForm onChangeSubType={onChangeSubType} />}
          {publicationContextType === PublicationType.DEGREE && <DegreeTypeForm onChangeSubType={onChangeSubType} />}
          {publicationContextType === PublicationType.CHAPTER && <ChapterTypeForm onChangeSubType={onChangeSubType} />}
          {publicationContextType === PublicationType.PUBLICATION_IN_JOURNAL && (
            <JournalTypeForm onChangeSubType={onChangeSubType} />
          )}
        </>
      )}
    </>
  );
};

export default ReferencesPanel;
