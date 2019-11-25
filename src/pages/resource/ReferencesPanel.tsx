import { Field, Form, Formik } from 'formik';
import { Select } from 'formik-material-ui';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { MenuItem } from '@material-ui/core';

import Box from '../../components/Box';
import TabPanel from '../../components/TabPanel/TabPanel';
import { RootStore } from '../../redux/reducers/rootReducer';
import { ReferenceType, referenceTypeList } from '../../types/references.types';
import { PublisherSearch } from './references/PublisherSearch';

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
  const initialFormikValues = {
    publisher: { title: '', issn: '', level: '', publisher: '' },
    reference_type: ReferenceType.PUBLICATION_IN_JOURNAL,
  };

  return (
    <TabPanel
      isHidden={tabNumber !== 2}
      ariaLabel="references"
      goToNextTab={goToNextTab}
      errors={errors.referencesErrors}
      heading="References">
      <Box>
        <Formik
          enableReinitialize
          initialValues={initialFormikValues}
          onSubmit={(values, { setSubmitting }) => {
            console.log(values);
            setSubmitting(false);
          }}>
          <Form>
            <StyledFieldWrapper>
              <Field
                name="reference_type"
                aria-label="reference_type"
                label="type"
                variant="outlined"
                fullWidth
                component={Select}>
                {referenceTypeList.map(reference => (
                  <MenuItem value={reference} key={reference} data-testid={`reference-type-${reference}`}>
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
                        <p>Tittel: {values.publisher.title}</p>
                        <p>ISSN: {values.publisher.issn}</p>
                        <p>Nivå: {values.publisher.level}</p>
                        <p>Utgiver: {values.publisher.publisher}</p>
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
