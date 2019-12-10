import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import TabPanel from '../../components/TabPanel/TabPanel';
import ContributorsPanel from './ContributorsPanel';
import DescriptionPanel from './DescriptionPanel';
import FilesAndLicensePanel from './FilesAndLicensePanel';
import PublicationPanel from './PublicationPanel';
import { ReferencesPanel } from './ReferencesPanel';
import { PublicationFormTabs } from './PublicationFormTabs';
import { emptyPublicationFormData } from '../../types/form.types';

const StyledPublication = styled.div`
  flex-grow: 1;
  width: 100%;
`;

const PublicationForm: React.FC = () => {
  const { t } = useTranslation('publication');
  const [tabNumber, setTabNumber] = useState(0);

  const validationSchema = Yup.object().shape({
    description: Yup.object().shape({
      title: Yup.string().required(t('publication:feedback.required_field')),
    }),
    reference: Yup.object().shape({
      referenceType: Yup.string().required(t('publication:feedback.required_field')),
    }),
  });

  const handleTabChange = (_: React.ChangeEvent<{}>, newTabNumber: number) => {
    setTabNumber(newTabNumber);
  };

  const goToNextTab = () => {
    setTabNumber(tabNumber + 1);
  };

  const savePublication = async (values: any) => {
    console.log('Save publication:', values);
  };

  return (
    <StyledPublication>
      <Formik
        initialValues={emptyPublicationFormData}
        validationSchema={validationSchema}
        onSubmit={values => savePublication(values)}>
        {({ values, errors, touched }) => (
          <Form>
            <PublicationFormTabs
              tabNumber={tabNumber}
              handleTabChange={handleTabChange}
              errors={errors}
              touched={touched}
            />
            <PublicationPanel tabNumber={tabNumber} goToNextTab={goToNextTab} />
            <DescriptionPanel
              tabNumber={tabNumber}
              goToNextTab={goToNextTab}
              savePublication={() => savePublication(values)}
            />
            <ReferencesPanel
              tabNumber={tabNumber}
              goToNextTab={goToNextTab}
              savePublication={() => savePublication(values)}
              selectedReferenceType={values.reference.referenceType}
            />
            <ContributorsPanel
              tabNumber={tabNumber}
              goToNextTab={goToNextTab}
              savePublication={() => savePublication(values)}
            />
            <FilesAndLicensePanel tabNumber={tabNumber} goToNextTab={goToNextTab} />
            <TabPanel isHidden={tabNumber !== 5} ariaLabel="submission" heading={t('heading.submission')}>
              <div>Page Six</div>
            </TabPanel>
          </Form>
        )}
      </Formik>
    </StyledPublication>
  );
};

export default PublicationForm;
