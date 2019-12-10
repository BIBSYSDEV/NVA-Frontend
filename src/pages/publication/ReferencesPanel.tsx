import { Field, Form, Formik } from 'formik';
import { Select } from 'formik-material-ui';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { MenuItem } from '@material-ui/core';

import Box from '../../components/Box';
import TabPanel from '../../components/TabPanel/TabPanel';
import { RootStore } from '../../redux/reducers/rootReducer';
import { emptyBookReferenceFormData, emptyJournalPublicationReferenceFormData } from '../../types/form.types';
import { ReferenceType, referenceTypeList } from '../../types/references.types';
import useFormPersistor from '../../utils/hooks/useFormPersistor';
import BookReferenceForm from './references_tab/BookReferenceForm';
import ChapterReferenceForm from './references_tab/ChapterReferenceForm';
import DegreeReferenceForm from './references_tab/DegreeReferenceForm';
import JournalPublicationReferenceForm from './references_tab/JournalPublicationReferenceForm';
import ReportReferenceForm from './references_tab/ReportReferenceForm';

const StyledBox = styled.div`
  margin-top: 1rem;
`;

const initialValues = {
  referenceType: '',
  book: emptyBookReferenceFormData,
  journalPublication: emptyJournalPublicationReferenceFormData,
};

interface ReferencesPanelProps {
  goToNextTab: () => void;
  savePublication: () => void;
  tabNumber: number;
}

export const ReferencesPanel: React.FC<ReferencesPanelProps> = ({ goToNextTab, savePublication, tabNumber }) => {
  const errors = useSelector((store: RootStore) => store.errors);
  const [persistedFormData, setPersistedFormData] = useFormPersistor('publicationReference', initialValues);
  const { t } = useTranslation('publication');

  return (
    <TabPanel
      ariaLabel="references"
      errors={errors.referencesErrors}
      goToNextTab={goToNextTab}
      heading={t('publication:heading.references')}
      isHidden={tabNumber !== 2}
      onClickSave={() => savePublication()}>
      <Formik
        initialValues={persistedFormData}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(false);
        }}>
        {({ values }) => (
          <Form
            onBlur={() => {
              setPersistedFormData(values);
            }}>
            <Field name="referenceType" aria-label="referenceType" variant="outlined" fullWidth component={Select}>
              {referenceTypeList.map(type => (
                <MenuItem value={type.value} key={type.value} data-testid={`referenceType-${type}`}>
                  {t(type.label)}
                </MenuItem>
              ))}
            </Field>

            {values.referenceType && (
              <StyledBox>
                <Box>
                  {values.referenceType === ReferenceType.BOOK && <BookReferenceForm />}
                  {values.referenceType === ReferenceType.CHAPTER && <ChapterReferenceForm />}
                  {values.referenceType === ReferenceType.REPORT && <ReportReferenceForm />}
                  {values.referenceType === ReferenceType.DEGREE && <DegreeReferenceForm />}
                  {values.referenceType === ReferenceType.PUBLICATION_IN_JOURNAL && <JournalPublicationReferenceForm />}
                </Box>
              </StyledBox>
            )}
          </Form>
        )}
      </Formik>
    </TabPanel>
  );
};

export default ReferencesPanel;
