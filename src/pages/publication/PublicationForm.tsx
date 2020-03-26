import { Form, Formik, FormikProps } from 'formik';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import TabPanel from '../../components/TabPanel/TabPanel';
import { emptyPublication, FormikPublication } from '../../types/publication.types';
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
import { publicationValidationSchema } from './PublicationFormValidationSchema';

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
  const [isLoading, setIsLoading] = useState(!!identifier);
  const dispatch = useDispatch();

  useEffect(() => {
    // Get files uploaded from new publication view
    const files = Object.values(uppy.getState().files).map(file => ({ ...emptyFile, ...(file as File) }));

    if (files?.length) {
      setInitialValues({
        ...emptyPublication,
        fileSet: files,
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

  const savePublication = async (values: FormikPublication) => {
    const { shouldCreateDoi, ...newPublication } = values;

    const updatedPublication = await updatePublication(newPublication);
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
        validationSchema={publicationValidationSchema}
        onSubmit={(values: FormikPublication) => savePublication(values)}>
        {({ values }: FormikProps<FormikPublication>) => (
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
