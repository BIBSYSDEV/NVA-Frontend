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
import { ReferenceType, referenceTypeList } from '../../types/references.types';
import PublisherSearch from './references/PublisherSearch';

const StyledFieldWrapper = styled.div`
  padding: 1rem;
  flex: 1 0 40%;
`;

interface ReferencesPanelProps {
  goToNextTab: () => void;
  tabNumber: number;
}
export const ReferencesPanel: React.FC<ReferencesPanelProps> = ({ goToNextTab, tabNumber }) => {
  const errors = useSelector((store: RootStore) => store.errors);
  const { t } = useTranslation();

  const initialFormikValues = {
    publisher: { title: '', issn: '', level: '', publisher: '' },
    referenceType: ReferenceType.PUBLICATION_IN_JOURNAL,
  };

  return (
    <TabPanel
      isHidden={tabNumber !== 2}
      ariaLabel="references"
      goToNextTab={goToNextTab}
      errors={errors.referencesErrors}
      heading="publication:references_heading">
      <Box>
        <Formik
          enableReinitialize
          initialValues={initialFormikValues}
          onSubmit={(values, { setSubmitting }) => {
            setSubmitting(false);
          }}>
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
                          {t('publication:references.title')}: {values.publisher.title}
                        </p>
                        <p>
                          {t('publication:references.ISSN')}: {values.publisher.issn}
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
