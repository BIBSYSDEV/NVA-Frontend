import { Form, Formik, FormikProps } from 'formik';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import * as Yup from 'yup';

import TabPanel from '../../components/TabPanel/TabPanel';
import { emptyPublication, Publication } from '../../types/publication.types';
import { ReferenceType } from '../../types/references.types';
import { createUppy } from '../../utils/uppy-config';
import ContributorsPanel from './ContributorsPanel';
import DescriptionPanel from './DescriptionPanel';
import FilesAndLicensePanel from './FilesAndLicensePanel';
import { PublicationFormTabs } from './PublicationFormTabs';
import ReferencesPanel from './ReferencesPanel';
import SubmissionPanel from './SubmissionPanel';

const StyledPublication = styled.div`
  width: 100%;
`;

const PublicationForm: FC = () => {
  const { t } = useTranslation('publication');
  const [tabNumber, setTabNumber] = useState(0);
  const [initialValues, setInitialValues] = useState(emptyPublication);
  const [uppy, setUppy] = useState();

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

      chapter: Yup.object().when('type', {
        is: ReferenceType.CHAPTER,
        then: Yup.object().shape({
          link: Yup.string().url(),
          pagesFrom: Yup.number(),
          pagesTo: Yup.number(),
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
    contributors: Yup.array()
      .of(
        Yup.object().shape({
          type: Yup.string(),
          name: Yup.string(),
          corresponding: Yup.bool(),
          email: Yup.string(),
          orcid: Yup.string(),
          systemControlNumber: Yup.string(),
          institutions: Yup.array().of(
            Yup.object().shape({
              id: Yup.string(),
              name: Yup.string(),
            })
          ),
        })
      )
      .min(1, 'you need to have at least one contributor'),
  });

  useEffect(() => {
    // TODO: Fetch publication by ID in URL
    const searchParams = new URLSearchParams(window.location.search);
    const title = searchParams.get('title') || '';

    setInitialValues({
      ...emptyPublication,
      title: {
        nb: title,
      },
    });
  }, []);

  useEffect(() => {
    // Set up Uppy for file uploading on form mount
    if (!uppy) {
      setUppy(createUppy());
    }
    return () => uppy && uppy.close();
  }, [uppy]);

  const handleTabChange = (_: React.ChangeEvent<{}>, newTabNumber: number) => {
    setTabNumber(newTabNumber);
  };

  const goToNextTab = () => {
    setTabNumber(tabNumber + 1);
  };

  const savePublication = async (values: Publication) => {};

  return (
    <StyledPublication>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values: Publication) => savePublication(values)}
        validateOnChange={false}>
        {({ values }: FormikProps<Publication>) => (
          <Form>
            <PublicationFormTabs tabNumber={tabNumber} handleTabChange={handleTabChange} />
            {tabNumber === 0 && (
              <DescriptionPanel goToNextTab={goToNextTab} savePublication={() => savePublication(values)} />
            )}
            {tabNumber === 1 && (
              <ReferencesPanel goToNextTab={goToNextTab} savePublication={() => savePublication(values)} />
            )}
            {tabNumber === 2 && (
              <ContributorsPanel goToNextTab={goToNextTab} savePublication={() => savePublication(values)} />
            )}
            {tabNumber === 3 && <FilesAndLicensePanel goToNextTab={goToNextTab} uppy={uppy} />}

            {tabNumber === 4 && (
              <TabPanel ariaLabel="submission">
                <SubmissionPanel />
              </TabPanel>
            )}
          </Form>
        )}
      </Formik>
    </StyledPublication>
  );
};

export default PublicationForm;
