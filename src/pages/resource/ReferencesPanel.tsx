import { Field, Form, Formik } from 'formik';
import { Select } from 'material-ui-formik-components/Select';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import Box from '../../components/Box';
import TabPanel from '../../components/TabPanel/TabPanel';
import { RootStore } from '../../redux/reducers/rootReducer';
import { ReferenceType, referenceTypeList } from '../../types/references.types';
import { PublisherSearch } from './references/PublisherSearch';

const StyledFieldWrapper = styled.div`
  padding: 1rem;
  flex: 1 0 40%;
`;

export interface ReferencesPanelProps {
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
                component={Select}
                options={referenceTypeList.map(reference => ({ value: reference, label: reference }))}
              />
            </StyledFieldWrapper>

            <StyledFieldWrapper>
              <Field name="publisher">
                {({ form: { values, setFieldValue } }: any) => {
                  console.log('formik values', values);
                  return (
                    <PublisherSearch
                      requestUrl="https://api.nsd.no/dbhapitjener/Tabeller/hentJSONTabellData"
                      searchTerm={values.publisher}
                      setFieldValue={setFieldValue}
                    />
                  );
                }}
              </Field>
            </StyledFieldWrapper>
            <button type="submit">Save</button>
          </Form>
        </Formik>
      </Box>
    </TabPanel>
  );
};

export default ReferencesPanel;
