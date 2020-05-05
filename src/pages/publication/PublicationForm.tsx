import { Form, Formik, FormikProps, yupToFormErrors, validateYupSchema } from 'formik';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { emptyPublication, FormikPublication, PublicationStatus } from '../../types/publication.types';
import { createUppy } from '../../utils/uppy-config';
import ContributorsPanel from './ContributorsPanel';
import DescriptionPanel from './DescriptionPanel';
import FilesAndLicensePanel from './FilesAndLicensePanel';
import { PublicationFormTabs } from './PublicationFormTabs';
import ReferencesPanel from './ReferencesPanel';
import SubmissionPanel from './SubmissionPanel';
import { emptyFile, Uppy, emptyFileSet } from '../../types/file.types';
import { getPublication, updatePublication } from '../../api/publicationApi';
import { useDispatch } from 'react-redux';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import deepmerge from 'deepmerge';
import Progress from '../../components/Progress';
import { publicationValidationSchema } from './PublicationFormValidationSchema';
import { Button } from '@material-ui/core';
import RouteLeavingGuard from '../../components/RouteLeavingGuard';
import { useHistory } from 'react-router';

const shouldAllowMultipleFiles = false;

const StyledPublication = styled.div`
  width: 100%;
`;

const StyledPanel = styled.div`
  margin-top: 2rem;
  margin-bottom: 1rem;
`;

const StyledButtonContainer = styled.div`
  margin-bottom: 1rem;
`;

const StyledButton = styled(Button)`
  margin-top: 1rem;
  margin-right: 0.5rem;
`;

const StyledProgressContainer = styled.div`
  padding-left: 1rem;
  display: flex;
  align-items: center;
`;

interface PublicationFormProps {
  closeForm: () => void;
  uppy: Uppy;
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
  const [isSaving, setIsSaving] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    return () => uppy && uppy.reset();
  }, [uppy]);

  useEffect(() => {
    const getPublicationById = async (id: string) => {
      const files = Object.values(uppy.getState().files).map((file) => ({
        ...emptyFile,
        identifier: file.response?.uploadURL ?? file.id,
        name: file.name,
        mimeType: file.type ?? '',
        size: file.size,
      }));

      const publication = await getPublication(id);

      if (publication.error) {
        closeForm();
        dispatch(setNotification(publication.error, NotificationVariant.Error));
      } else if (publication.status === PublicationStatus.PUBLISHED) {
        history.push(`/publication/${id}/public`);
      } else {
        // TODO: revisit necessity of deepmerge when backend model has all fields
        setInitialValues(
          deepmerge(
            {
              ...emptyPublication,
              fileSet: { ...emptyFileSet, files },
            },
            publication
          )
        );
        setIsLoading(false);
      }
    };

    if (identifier) {
      getPublicationById(identifier);
    }
  }, [identifier, closeForm, dispatch, history, uppy]);

  const handleTabChange = (_: React.ChangeEvent<{}>, newTabNumber: number) => {
    setTabNumber(newTabNumber);
  };

  const goToNextTab = () => {
    setTabNumber(tabNumber + 1);
  };

  const savePublication = async (values: FormikPublication) => {
    const { shouldCreateDoi, ...newPublication } = values;
    setIsSaving(true);
    const updatedPublication = await updatePublication(newPublication);
    if (updatedPublication?.error) {
      dispatch(setNotification(updatedPublication.error, NotificationVariant.Error));
    } else {
      setInitialValues(deepmerge(emptyPublication, updatedPublication));
      dispatch(setNotification(t('feedback:success.update_publication')));
    }
    setIsSaving(false);
  };

  const validateForm = (values: FormikPublication) => {
    const { publicationType, reference: publicationInstance } = values.entityDescription;
    try {
      validateYupSchema<FormikPublication>(values, publicationValidationSchema, true, {
        publicationInstanceType: publicationInstance.type,
        publicationType,
      });
    } catch (err) {
      return yupToFormErrors(err);
    }
    return {};
  };

  return isLoading ? (
    <Progress />
  ) : (
    <StyledPublication>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validate={validateForm}
        validateOnChange={false}
        onSubmit={(values: FormikPublication) => savePublication(values)}>
        {({ dirty, values, isValid }: FormikProps<FormikPublication>) => (
          <>
            <RouteLeavingGuard
              modalDescription={t('modal_unsaved_changes_description')}
              modalHeading={t('modal_unsaved_changes_heading')}
              shouldBlockNavigation={dirty || !isValid}
            />
            <Form>
              <PublicationFormTabs tabNumber={tabNumber} handleTabChange={handleTabChange} />
              {tabNumber === 0 && (
                <StyledPanel>
                  <DescriptionPanel aria-label="description" />
                </StyledPanel>
              )}
              {tabNumber === 1 && (
                <StyledPanel aria-label="references">
                  <ReferencesPanel />
                </StyledPanel>
              )}
              {tabNumber === 2 && (
                <StyledPanel aria-label="references">
                  <ContributorsPanel />
                </StyledPanel>
              )}
              {tabNumber === 3 && (
                <StyledPanel aria-label="files and license">
                  <FilesAndLicensePanel uppy={uppy} />
                </StyledPanel>
              )}
              {tabNumber === 4 && (
                <StyledPanel aria-label="submission">
                  <SubmissionPanel isSaving={isSaving} savePublication={savePublication} />
                </StyledPanel>
              )}
            </Form>
            {tabNumber !== 4 && (
              <StyledButtonContainer>
                <StyledButton color="primary" variant="contained" onClick={goToNextTab}>
                  {t('common:next')}
                </StyledButton>

                <StyledButton disabled={isSaving} onClick={() => savePublication(values)} variant="contained">
                  {t('common:save')}
                  {isSaving && (
                    <StyledProgressContainer>
                      <Progress size={15} thickness={5} />
                    </StyledProgressContainer>
                  )}
                </StyledButton>
              </StyledButtonContainer>
            )}
          </>
        )}
      </Formik>
    </StyledPublication>
  );
};

export default PublicationForm;
