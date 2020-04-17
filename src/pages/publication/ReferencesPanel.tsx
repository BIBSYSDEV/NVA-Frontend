import { FormikProps, useFormikContext } from 'formik';
import React, { useEffect } from 'react';
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

const StyledCard = styled(Card)`
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
  const { publicationType, publicationSubtype } = values.entityDescription;

  useEffect(
    // Set all fields as touched if user navigates away from this panel (on unmount)
    () => () => Object.values(ReferenceFieldNames).forEach((fieldName) => setFieldTouched(fieldName)),
    [setFieldTouched]
  );

  useEffect(() => {
    // Update publicationInstance's type when publicationSubtype changes
    setFieldValue(ReferenceFieldNames.PUBLICATION_INSTANCE_TYPE, publicationSubtype);
  }, [setFieldValue, publicationSubtype]);

  return (
    <TabPanel ariaLabel="references" goToNextTab={goToNextTab} onClickSave={() => savePublication()}>
      <StyledSelectContainer>
        <SelectTypeField
          fieldName={ReferenceFieldNames.PUBLICATION_TYPE}
          options={Object.values(PublicationType)}
          onChangeType={() => {
            // Ensure some values are reset when publicationType changes
            setFieldValue(ReferenceFieldNames.SUB_TYPE, '');
            setFieldValue(ReferenceFieldNames.PUBLICATION_CONTEXT, null);
            // Avoid showing potential errors instantly
            Object.values(ReferenceFieldNames).forEach((fieldName) => setFieldTouched(fieldName, false));
          }}
        />
      </StyledSelectContainer>

      {publicationType && (
        <StyledCard>
          <Heading data-testid="publication_type-heading">{t(`publicationTypes:${publicationType}`)}</Heading>
          {publicationType === PublicationType.BOOK && <BookForm />}
          {publicationType === PublicationType.CHAPTER && <ChapterForm />}
          {publicationType === PublicationType.REPORT && <ReportForm />}
          {publicationType === PublicationType.DEGREE && <DegreeForm />}
          {publicationType === PublicationType.PUBLICATION_IN_JOURNAL && <JournalArticleForm />}
        </StyledCard>
      )}
    </TabPanel>
  );
};

export default ReferencesPanel;
