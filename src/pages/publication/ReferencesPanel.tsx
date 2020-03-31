import { FormikProps, useFormikContext } from 'formik';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import TabPanel from '../../components/TabPanel/TabPanel';
import { FormikPublication } from '../../types/publication.types';
import { PublicationType, ReferenceFieldNames } from '../../types/publicationFieldNames';
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
  }, [setFieldTouched]);

  useEffect(
    () => () => {
      // Set all fields as touched if user navigates away from this panel (on unmount)
      setAllFieldsTouched();
    },
    [setAllFieldsTouched]
  );

  return (
    <TabPanel ariaLabel="references" goToNextTab={goToNextTab} onClickSave={() => savePublication()}>
      <StyledSelectContainer>
        <SelectTypeField
          fieldName={ReferenceFieldNames.PUBLICATION_TYPE}
          options={Object.values(PublicationType)}
          onChangeExtension={() => setFieldValue(ReferenceFieldNames.SUB_TYPE, '')}
        />
      </StyledSelectContainer>

      {publicationType && (
        <StyledBox>
          <Card>
            <Heading data-testid="publication_type-heading">{t(`publicationTypes:${publicationType}`)}</Heading>
            {publicationType === PublicationType.BOOK && <BookForm />}
            {publicationType === PublicationType.CHAPTER && <ChapterForm />}
            {publicationType === PublicationType.REPORT && <ReportForm />}
            {publicationType === PublicationType.DEGREE && <DegreeForm />}
            {publicationType === PublicationType.PUBLICATION_IN_JOURNAL && <JournalArticleForm />}
          </Card>
        </StyledBox>
      )}
    </TabPanel>
  );
};

export default ReferencesPanel;
