import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Formik, Form, FormikProps } from 'formik';
import * as Yup from 'yup';

import TabPanel from '../../components/TabPanel/TabPanel';
import ContributorsPanel from './ContributorsPanel';
import DescriptionPanel from './DescriptionPanel';
import FilesAndLicensePanel from './FilesAndLicensePanel';
import PublicationPanel from './PublicationPanel';
import { ReferencesPanel } from './ReferencesPanel';
import { PublicationFormTabs } from './PublicationFormTabs';
import { emptyPublicationFormData, PublicationFormsData } from '../../types/form.types';
import { ReferenceType } from '../../types/references.types';
import useLocalStorage from '../../utils/hooks/useLocalStorage';

const StyledPublication = styled.div`
  width: 100%;
`;

const PublicationForm: React.FC = () => {
  const { t } = useTranslation('publication');
  const [tabNumber, setTabNumber] = useState(0);
  const [localStorageFormData, setLocalStorageFormData, clearLocalStorageFormData] = useLocalStorage(
    'publicationFormData',
    emptyPublicationFormData
  );

  const validationSchema = Yup.object().shape({
    description: Yup.object().shape({
      title: Yup.string().required(t('publication:feedback.required_field')),
    }),
    reference: Yup.object().shape({
      referenceType: Yup.string().required(t('publication:feedback.required_field')),

      journalPublication: Yup.object().when('referenceType', {
        is: ReferenceType.PUBLICATION_IN_JOURNAL,
        then: Yup.object().shape({
          type: Yup.string(),
          doi: Yup.string().url(),
        }),
      }),

      book: Yup.object().when('referenceType', {
        is: ReferenceType.BOOK,
        then: Yup.object().shape({
          type: Yup.string(),
          publisher: Yup.object(),
        }),
      }),
    }),
  });

  const handleTabChange = (_: React.ChangeEvent<{}>, newTabNumber: number) => {
    setTabNumber(newTabNumber);
  };

  const goToNextTab = () => {
    setTabNumber(tabNumber + 1);
  };

  const savePublication = async (values: PublicationFormsData) => {
    console.log('Save publication:', values);
    clearLocalStorageFormData();
  };

  return (
    <StyledPublication>
      <Formik
        initialValues={localStorageFormData}
        validationSchema={validationSchema}
        onSubmit={(values: PublicationFormsData) => savePublication(values)}
        validateOnChange={false}>
        {({ values, errors, touched }: FormikProps<any>) => (
          <Form onBlur={() => setLocalStorageFormData(values)}>
            <PublicationFormTabs
              tabNumber={tabNumber}
              handleTabChange={handleTabChange}
              errors={errors}
              touched={touched}
            />
            {tabNumber === 0 && <PublicationPanel goToNextTab={goToNextTab} />}
            {tabNumber === 1 && (
              <DescriptionPanel goToNextTab={goToNextTab} savePublication={() => savePublication(values)} />
            )}
            {tabNumber === 2 && (
              <ReferencesPanel goToNextTab={goToNextTab} savePublication={() => savePublication(values)} />
            )}
            {tabNumber === 3 && (
              <ContributorsPanel goToNextTab={goToNextTab} savePublication={() => savePublication(values)} />
            )}
            {tabNumber === 4 && <FilesAndLicensePanel goToNextTab={goToNextTab} />}

            {tabNumber === 5 && (
              <TabPanel ariaLabel="submission" heading={t('heading.submission')}>
                <div>Page Six</div>
              </TabPanel>
            )}
          </Form>
        )}
      </Formik>
    </StyledPublication>
  );
};

export default PublicationForm;
