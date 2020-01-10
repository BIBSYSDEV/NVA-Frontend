import { Form, Formik, FormikProps } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import * as Yup from 'yup';

import TabPanel from '../../components/TabPanel/TabPanel';
import { checkLocalStorageVersion } from '../../utils/local-storage-versioning';
import ContributorsPanel from './ContributorsPanel';
import DescriptionPanel from './DescriptionPanel';
import FilesAndLicensePanel from './FilesAndLicensePanel';
import { PublicationFormTabs } from './PublicationFormTabs';
import PublicationPanel from './PublicationPanel';
import { ReferencesPanel } from './ReferencesPanel';
import { ReferenceType } from '../../types/references.types';
import useLocalStorage from '../../utils/hooks/useLocalStorage';
import { Publication, emptyPublication } from '../../types/publication.types';

const StyledPublication = styled.div`
  width: 100%;
`;

const PublicationForm: React.FC = () => {
  const { t } = useTranslation('publication');
  const [tabNumber, setTabNumber] = useState(1);

  checkLocalStorageVersion();
  const [localStorageFormData, setLocalStorageFormData, clearLocalStorageFormData] = useLocalStorage(
    'publicationFormData',
    emptyPublication
  );

  const validationSchema = Yup.object().shape({
    title: Yup.object().shape({
      nb: Yup.string().required(t('publication:feedback.required_field')),
    }),

    reference: Yup.object().shape({
      type: Yup.string().required(t('publication:feedback.required_field')),

      journalArticle: Yup.object().when('type', {
        is: ReferenceType.PUBLICATION_IN_JOURNAL,
        then: Yup.object().shape({
          type: Yup.string(),
          doi: Yup.string().url(),
          journal: Yup.object(),
          volume: Yup.number(),
          issue: Yup.number(),
          pagesFrom: Yup.number(),
          pagesTo: Yup.number(),
          articleNumber: Yup.string(),
          peerReview: Yup.bool(),
        }),
      }),

      book: Yup.object().when('type', {
        is: ReferenceType.BOOK,
        then: Yup.object().shape({
          type: Yup.string(),
          publisher: Yup.object(),
          isbn: Yup.string(),
          peerReview: Yup.bool(),
          textBook: Yup.bool(),
          numberOfPages: Yup.string(),
          series: Yup.string(),
        }),
      }),

      report: Yup.object().when('type', {
        is: ReferenceType.REPORT,
        then: Yup.object().shape({
          type: Yup.string(),
          publisher: Yup.object(),
          isbn: Yup.string(),
          numberOfPages: Yup.string(),
          series: Yup.string(),
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

  const savePublication = async (values: Publication) => {
    clearLocalStorageFormData();
  };

  return (
    <StyledPublication>
      <Formik
        initialValues={localStorageFormData}
        validationSchema={validationSchema}
        onSubmit={(values: Publication) => savePublication(values)}
        validateOnChange={false}>
        {({ values }: FormikProps<Publication>) => (
          <Form onBlur={() => setLocalStorageFormData(values)}>
            <PublicationFormTabs tabNumber={tabNumber} handleTabChange={handleTabChange} />
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
              <TabPanel ariaLabel="submission">
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
