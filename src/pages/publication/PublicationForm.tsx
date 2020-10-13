import React, { FC, useEffect, useState } from 'react';
import { Form, Formik, FormikProps, yupToFormErrors, validateYupSchema, setNestedObjectValues } from 'formik';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import deepmerge from 'deepmerge';
import { CircularProgress, Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

import { emptyPublication, Publication, PublicationTab } from '../../types/publication.types';
import { PublicationFormTabs } from './PublicationFormTabs';
import { updatePublication } from '../../api/publicationApi';
import { useDispatch, useSelector } from 'react-redux';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import RouteLeavingGuard from '../../components/RouteLeavingGuard';
import ButtonWithProgress from '../../components/ButtonWithProgress';
import { PublicationFormContent } from './PublicationFormContent';
import { RootStore } from '../../redux/reducers/rootReducer';
import useFetchPublication from '../../utils/hooks/useFetchPublication';
import useUppy from '../../utils/hooks/useUppy';
import { publicationValidationSchema } from '../../utils/validation/publication/publicationValidation';
import { PageHeader } from '../../components/PageHeader';
import Forbidden from '../errorpages/Forbidden';

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
  identifier?: string;
}

const PublicationForm: FC<PublicationFormProps> = ({ identifier, closeForm }) => {
  const user = useSelector((store: RootStore) => store.user);
  const { t } = useTranslation('publication');
  const history = useHistory();
  const initialTabNumber = new URLSearchParams(history.location.search).get('tab');
  const [tabNumber, setTabNumber] = useState(initialTabNumber ? +initialTabNumber : PublicationTab.Description);
  const [isSaving, setIsSaving] = useState(false);
  const dispatch = useDispatch();
  const uppy = useUppy();
  const [publication, isLoadingPublication, handleSetPublication] = useFetchPublication(identifier);
  const isOwner = publication?.owner === user.id;

  useEffect(() => {
    if (!publication && !isLoadingPublication) {
      closeForm();
    }
  }, [closeForm, publication, isLoadingPublication]);

  useEffect(() => {
    if (publication) {
      // Redirect to public page if user should not be able to edit this publication
      const isValidOwner = user.isCreator && user.id === publication.owner;
      const isValidCurator = user.isCurator && user.customerId === publication.publisher.id;
      if (!isValidOwner && !isValidCurator) {
        history.push(`/registration/${publication.identifier}/public`);
      }
    }
  }, [history, publication, user]);

  const handleTabChange = (_: React.ChangeEvent<{}>, newTabNumber: number) => {
    setTabNumber(newTabNumber);
  };

  const goToNextTab = () => {
    setTabNumber(tabNumber + 1);
  };

  const savePublication = async (values: Publication) => {
    setIsSaving(true);
    const updatedPublication = await updatePublication(values);
    if (updatedPublication?.error) {
      dispatch(setNotification(updatedPublication.error, NotificationVariant.Error));
    } else {
      handleSetPublication(deepmerge(emptyPublication, updatedPublication));
      dispatch(setNotification(t('feedback:success.update_publication')));
    }
    setIsSaving(false);
  };

  const validateForm = (values: Publication) => {
    const {
      reference: { publicationContext },
    } = values.entityDescription;
    try {
      validateYupSchema<Publication>(values, publicationValidationSchema, true, {
        publicationContextType: publicationContext.type,
        publicationStatus: publication?.status,
      });
    } catch (err) {
      return yupToFormErrors(err);
    }
    return {};
  };

  return isLoadingPublication ? (
    <CircularProgress />
  ) : !isOwner && !user.isCurator ? (
    <Forbidden />
  ) : (
    <>
      <PageHeader>{t('edit_publication')}</PageHeader>
      <StyledPublication>
        <Formik
          enableReinitialize
          initialValues={publication ? deepmerge(emptyPublication, publication) : emptyPublication}
          validate={validateForm}
          onSubmit={() => {
            /* Use custom save handler instead, since onSubmit will prevent saving if there are any errors */
          }}>
          {({ setTouched, dirty, errors, values }: FormikProps<Publication>) => (
            <Form>
              <RouteLeavingGuard
                modalDescription={t('modal_unsaved_changes_description')}
                modalHeading={t('modal_unsaved_changes_heading')}
                shouldBlockNavigation={dirty}
              />
              <PublicationFormTabs tabNumber={tabNumber} handleTabChange={handleTabChange} />
              <PublicationFormContent
                tabNumber={tabNumber}
                uppy={uppy}
                isSaving={isSaving}
                savePublication={savePublication}
              />
              {tabNumber !== PublicationTab.Submission && (
                <StyledButtonGroupContainer>
                  <StyledButtonContainer>
                    <Button color="primary" variant="contained" data-testid="button-next-tab" onClick={goToNextTab}>
                      {t('common:next')}
                    </Button>
                  </StyledButtonContainer>

                  <StyledButtonContainer>
                    <ButtonWithProgress
                      isLoading={isSaving}
                      data-testid="button-save-publication"
                      onClick={async () => {
                        await savePublication(values);
                        // Set all fields with error to touched to ensure error messages are shown
                        setTouched(setNestedObjectValues(errors, true));
                      }}>
                      {t('common:save')}
                    </ButtonWithProgress>
                  </StyledButtonContainer>
                </StyledButtonGroupContainer>
              )}
            </Form>
          )}
        </Formik>
      </StyledPublication>
    </>
  );
};

export default PublicationForm;
