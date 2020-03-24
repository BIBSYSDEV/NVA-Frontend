import { FormikProps, useFormikContext } from 'formik';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import TabPanel from '../../components/TabPanel/TabPanel';
import { FormikPublication } from '../../types/publication.types';
import {
  BookFieldNames,
  ChapterFieldNames,
  DegreeFieldNames,
  JournalArticleFieldNames,
  ReferenceFieldNames,
  ReferenceType,
  ReportFieldNames,
} from '../../types/references.types';
import BookForm from './references_tab/BookForm';
import ChapterForm from './references_tab/ChapterForm';
import DegreeForm from './references_tab/DegreeForm';
import JournalArticleForm from './references_tab/JournalArticleForm';
import ReportForm from './references_tab/ReportForm';
import Card from '../../components/Card';
import Heading from '../../components/Heading';
import SelectTypeField from './references_tab/components/SelectTypeField';

const StyledBox = styled.div`
  margin-top: 1rem;
`;

const StyledSelectContainer = styled.div`
  width: 50%;
`;

interface ReferencesPanelProps {
  goToNextTab: () => void;
  savePublication: () => void;
}

const ReferencesPanel: React.FC<ReferencesPanelProps> = ({ goToNextTab, savePublication }) => {
  const { t } = useTranslation('publication');
  const { values, setFieldTouched, setFieldValue }: FormikProps<FormikPublication> = useFormikContext();
  const { publicationType } = values.entityDescription;

  // Validation messages won't show on fields that are not touched
  const setAllFieldsTouched = useCallback(() => {
    Object.values(ReferenceFieldNames).forEach((fieldName) => setFieldTouched(fieldName));

    switch (publicationType) {
      case ReferenceType.BOOK:
        Object.values(BookFieldNames).forEach((fieldName) => setFieldTouched(fieldName));
        break;
      case ReferenceType.PUBLICATION_IN_JOURNAL:
        Object.values(JournalArticleFieldNames).forEach((fieldName) => setFieldTouched(fieldName));
        break;
      case ReferenceType.REPORT:
        Object.values(ReportFieldNames).forEach((fieldName) => setFieldTouched(fieldName));
        break;
      case ReferenceType.CHAPTER:
        Object.values(ChapterFieldNames).forEach((fieldName) => setFieldTouched(fieldName));
        break;
      case ReferenceType.DEGREE:
        Object.values(DegreeFieldNames).forEach((fieldName) => setFieldTouched(fieldName));
        break;
      default:
        break;
    }
  }, [setFieldTouched, publicationType]);

  useEffect(() => {
    // Set all fields as touched if user navigates away from this panel ( on unmount)
    return () => setAllFieldsTouched();
  }, [setAllFieldsTouched]);

  return (
    <TabPanel ariaLabel="references" goToNextTab={goToNextTab} onClickSave={() => savePublication()}>
      <StyledSelectContainer>
        <SelectTypeField
          fieldName={ReferenceFieldNames.PUBLICATION_TYPE}
          options={Object.values(ReferenceType)}
          onChangeExtension={() => setFieldValue(JournalArticleFieldNames.SUB_TYPE, '')}
        />
      </StyledSelectContainer>

      {publicationType && (
        <StyledBox>
          <Card>
            <Heading data-testid="publication_type-heading">{t(`publicationTypes:${publicationType}`)}</Heading>
            {publicationType === ReferenceType.BOOK && <BookForm />}
            {publicationType === ReferenceType.CHAPTER && <ChapterForm />}
            {publicationType === ReferenceType.REPORT && <ReportForm />}
            {publicationType === ReferenceType.DEGREE && <DegreeForm />}
            {publicationType === ReferenceType.PUBLICATION_IN_JOURNAL && <JournalArticleForm />}
          </Card>
        </StyledBox>
      )}
    </TabPanel>
  );
};

export default ReferencesPanel;
