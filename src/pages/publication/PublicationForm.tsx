import { Form, Formik, FormikProps } from 'formik';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import * as Yup from 'yup';

import TabPanel from '../../components/TabPanel/TabPanel';
import { emptyPublication, Publication, BackendPublication } from '../../types/publication.types';
import { ReferenceType } from '../../types/references.types';
import { createUppy } from '../../utils/uppy-config';
import ContributorsPanel from './ContributorsPanel';
import DescriptionPanel from './DescriptionPanel';
import FilesAndLicensePanel from './FilesAndLicensePanel';
import { PublicationFormTabs } from './PublicationFormTabs';
import ReferencesPanel from './ReferencesPanel';
import SubmissionPanel from './SubmissionPanel';
import { emptyFile, File, Uppy } from '../../types/file.types';
import { getPublication, updatePublication } from '../../api/publicationApi';
import { useDispatch } from 'react-redux';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import deepmerge from 'deepmerge';
import Progress from '../../components/Progress';

const shouldAllowMultipleFiles = false;

const StyledPublication = styled.div`
  width: 100%;
`;

interface PublicationFormProps {
  uppy: Uppy;
  closeForm: () => void;
  identifier?: string;
}

const PublicationForm: FC<PublicationFormProps> = ({
  uppy = createUppy(shouldAllowMultipleFiles),
  identifier,
  closeForm,
}) => {
  const { t } = useTranslation('publication');
  const [tabNumber, setTabNumber] = useState(0);
  const [initialValues, setInitialValues] = useState(emptyPublication);
  const [publicationValues, setPublicationValues] = useState(); // TODO: remove this when backend model fits frontend model
  const [isLoading, setIsLoading] = useState(!!identifier);
  const dispatch = useDispatch();

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
      .min(1, t('publication:feedback.minimum_one_contributor')),
  });

  useEffect(() => {
    // Get files uploaded from new publication view
    const files = Object.values(uppy.getState().files).map(file => ({ ...emptyFile, ...(file as File) }));

    if (files?.length) {
      setInitialValues({
        ...emptyPublication,
        files,
      });
    }
  }, [uppy]);

  useEffect(() => {
    return () => uppy && uppy.close();
  }, [uppy]);

  useEffect(() => {
    const getPublicationById = async (id: string) => {
      const publication = await getPublication(id);
      if (publication.error) {
        closeForm();
        dispatch(setNotification(publication.error, NotificationVariant.Error));
      } else {
        // TODO: revisit necessity of deepmerge when backend model has all fields
        setInitialValues(deepmerge(emptyPublication, publication));
        setPublicationValues(publication);
        setIsLoading(false);
      }
    };

    if (identifier) {
      getPublicationById(identifier);
    }
  }, [identifier, closeForm, dispatch]);

  const handleTabChange = (_: React.ChangeEvent<{}>, newTabNumber: number) => {
    setTabNumber(newTabNumber);
  };

  const goToNextTab = () => {
    setTabNumber(tabNumber + 1);
  };

  const savePublication = async (values: BackendPublication) => {
    const updatedPublication = await updatePublication({
      ...publicationValues,
      entityDescription: values.entityDescription,
    });
    if (updatedPublication.error) {
      dispatch(setNotification(updatedPublication.error, NotificationVariant.Error));
    } else {
      dispatch(setNotification(t('feedback:success.update_publication')));
    }
  };

  return isLoading ? (
    <Progress />
  ) : (
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
                <SubmissionPanel savePublication={() => savePublication(values)} />
              </TabPanel>
            )}
          </Form>
        )}
      </Formik>
    </StyledPublication>
  );
};

export default PublicationForm;
