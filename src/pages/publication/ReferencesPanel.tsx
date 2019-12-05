import { Field, Formik } from 'formik';
import { Select } from 'formik-material-ui';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { MenuItem } from '@material-ui/core';

import Box from '../../components/Box';
import TabPanel from '../../components/TabPanel/TabPanel';
import { RootStore } from '../../redux/reducers/rootReducer';
import { emptyReferencesForm, ReferencesFormData } from '../../types/form.types';
import { ReferenceType, referenceTypeList } from '../../types/references.types';
import useFormPersistor from '../../utils/hooks/useFormPersistor';
import ReportReferenceForm from './references_tab/ReportReferenceForm';
import BookReferenceForm from './references_tab/BookReferenceForm';
import ChapterReferenceForm from './references_tab/ChapterReferenceForm';
import JournalPublicationReferenceForm from './references_tab/JournalPublicationReferenceForm';
import DegreeReferenceForm from './references_tab/DegreeReferenceForm';

const StyledFieldWrapper = styled.div`
  padding: 1rem;
  flex: 1 0 40%;
`;

interface ReferencesPanelProps {
  goToNextTab: () => void;
  savePublication: () => void;
  tabNumber: number;
}
export const ReferencesPanel: React.FC<ReferencesPanelProps> = ({ goToNextTab, savePublication, tabNumber }) => {
  const errors = useSelector((store: RootStore) => store.errors);
  const { t } = useTranslation();
  const [persistedFormData, setPersistedFormData, clearPersistedData] = useFormPersistor(
    'publicationReferences',
    emptyReferencesForm
  );

  const initialFormikValues = {
    publisher: {
      issn: (persistedFormData.publisher && persistedFormData.publisher.issn) || '',
      level: (persistedFormData.publisher && persistedFormData.publisher.level) || '',
      publisher: (persistedFormData.publisher && persistedFormData.publisher.publisher) || '',
      title: (persistedFormData.publisher && persistedFormData.publisher.title) || '',
    },
    referenceType: persistedFormData.referenceType || ReferenceType.PUBLICATION_IN_JOURNAL,
  };

  return (
    <TabPanel
      ariaLabel="references"
      errors={errors.referencesErrors}
      goToNextTab={goToNextTab}
      heading={t('publication:heading.references')}
      isHidden={tabNumber !== 2}
      onClickSave={() => {
        savePublication();
        clearPersistedData();
      }}>
      <Box>
        <Formik
          enableReinitialize
          initialValues={initialFormikValues}
          onSubmit={(values, { setSubmitting }) => {
            setSubmitting(false);
          }}
          validate={(values: ReferencesFormData) => setPersistedFormData(values)}>
          {({ values }) => (
            <>
              <StyledFieldWrapper>
                <Field
                  name="referenceType"
                  aria-label="referenceType"
                  label="type"
                  variant="outlined"
                  fullWidth
                  component={Select}>
                  {referenceTypeList.map(reference => (
                    <MenuItem value={reference} key={reference} data-testid={`referenceType-${reference}`}>
                      {reference}
                    </MenuItem>
                  ))}
                </Field>
              </StyledFieldWrapper>

              {values.referenceType === ReferenceType.BOOK && <BookReferenceForm />}
              {values.referenceType === ReferenceType.CHAPTER && <ChapterReferenceForm />}
              {values.referenceType === ReferenceType.REPORT && <ReportReferenceForm />}
              {values.referenceType === ReferenceType.DEGREE && <DegreeReferenceForm />}
              {values.referenceType === ReferenceType.PUBLICATION_IN_JOURNAL && <JournalPublicationReferenceForm />}
            </>
          )}
        </Formik>
      </Box>
    </TabPanel>
  );
};

export default ReferencesPanel;
