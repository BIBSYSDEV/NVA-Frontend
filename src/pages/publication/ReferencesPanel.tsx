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
import { emptyReferencesForm, ReferencesFormData } from '../../types/form.types';
import { ReferenceType, referenceTypeList } from '../../types/references.types';
import useFormPersistor from '../../utils/hooks/useFormPersistor';
import PublisherSearch from './references_tab/PublisherSearch';

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
          <Form>
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

            <StyledFieldWrapper>
              <Field name="publisher">
                {({ form: { values, setFieldValue } }: any) => (
                  <>
                    <PublisherSearch setFieldValue={setFieldValue} />
                    {values && values.publisher && values.publisher.title && (
                      <div>
                        <p>
                          {t('common:title')}: {values.publisher.title}
                        </p>
                        <p>
                          {t('publication:references.issn')}: {values.publisher.issn}
                        </p>
                        <p>
                          {t('publication:references.level')}: {values.publisher.level}
                        </p>
                        <p>
                          {t('publication:references.publisher')}: {values.publisher.publisher}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </Field>
            </StyledFieldWrapper>
          </Form>
        </Formik>
      </Box>
    </TabPanel>
  );
};

export default ReferencesPanel;
