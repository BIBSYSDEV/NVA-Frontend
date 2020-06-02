import { Form, Formik, FormikProps, yupToFormErrors, validateYupSchema } from 'formik';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { emptyPublication, FormikPublication, PublicationTab } from '../../types/publication.types';
import { createUppy } from '../../utils/uppy-config';
import { PublicationFormTabs } from './PublicationFormTabs';
import { Uppy } from '../../types/file.types';
import { updatePublication } from '../../api/publicationApi';
import { useDispatch, useSelector } from 'react-redux';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import deepmerge from 'deepmerge';
import { publicationValidationSchema } from './PublicationFormValidationSchema';
import { Button, CircularProgress } from '@material-ui/core';
import RouteLeavingGuard from '../../components/RouteLeavingGuard';
import ButtonWithProgress from '../../components/ButtonWithProgress';
import { PublicationFormContent } from './PublicationFormContent';
import { RootStore } from '../../redux/reducers/rootReducer';
import useFetchPublication from '../../utils/hooks/useFetchPublication';

const shouldAllowMultipleFiles = false;

const StyledPublication = styled.div`
  width: 100%;
`;

const StyledButtonGroupContainer = styled.div`
  margin-bottom: 1rem;
`;

const StyledButtonContainer = styled.div`
  display: inline-block;
  margin-top: 1rem;
  margin-right: 0.5rem;
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
  const user = useSelector((store: RootStore) => store.user);
  const { t } = useTranslation('publication');
  const [tabNumber, setTabNumber] = useState(user.isCurator ? PublicationTab.Submission : PublicationTab.Description);
  const [isSaving, setIsSaving] = useState(false);
  const dispatch = useDispatch();
  const [publication, isLoadingPublication, handleSetPublication] = useFetchPublication(identifier, true);

  useEffect(() => {
    if (!publication && !isLoadingPublication) {
      closeForm();
    }
  }, [closeForm, publication, isLoadingPublication]);

  useEffect(
    () => () => {
      uppy && uppy.reset();
    },
    [uppy]
  );

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
      handleSetPublication(deepmerge(emptyPublication, updatedPublication));
      dispatch(setNotification(t('feedback:success.update_publication')));
    }
    setIsSaving(false);
  };

  const validateForm = (values: FormikPublication) => {
    const {
      reference: { publicationInstance, publicationContext },
    } = values.entityDescription;
    try {
      validateYupSchema<FormikPublication>(values, publicationValidationSchema, true, {
        publicationInstanceType: publicationInstance.type,
        publicationContextType: publicationContext.type,
      });
    } catch (err) {
      return yupToFormErrors(err);
    }
    return {};
  };

  return isLoadingPublication ? (
    <CircularProgress />
  ) : (
    <StyledPublication>
      <Formik
        enableReinitialize
        initialValues={publication ?? emptyPublication}
        validate={validateForm}
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
              <PublicationFormContent
                tabNumber={tabNumber}
                uppy={uppy}
                isSaving={isSaving}
                savePublication={savePublication}
              />
            </Form>
            {tabNumber !== PublicationTab.Submission && (
              <StyledButtonGroupContainer>
                <StyledButtonContainer>
                  <Button color="primary" variant="contained" onClick={goToNextTab}>
                    {t('common:next')}
                  </Button>
                </StyledButtonContainer>

                <StyledButtonContainer>
                  <ButtonWithProgress isLoading={isSaving} onClick={() => savePublication(values)}>
                    {t('common:save')}
                  </ButtonWithProgress>
                </StyledButtonContainer>
              </StyledButtonGroupContainer>
            )}
          </>
        )}
      </Formik>
    </StyledPublication>
  );
};

export default PublicationForm;
