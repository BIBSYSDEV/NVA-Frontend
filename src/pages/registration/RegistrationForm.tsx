import React, { FC, useEffect, useState } from 'react';
import { Form, Formik, FormikProps, yupToFormErrors, validateYupSchema } from 'formik';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import deepmerge from 'deepmerge';
import { CircularProgress } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

import { emptyRegistration, Registration, RegistrationTab } from '../../types/registration.types';
import { RegistrationFormTabs } from './RegistrationFormTabs';
import { updateRegistration } from '../../api/registrationApi';
import { useDispatch, useSelector } from 'react-redux';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import RouteLeavingGuard from '../../components/RouteLeavingGuard';
import { RegistrationFormContent } from './RegistrationFormContent';
import { RootStore } from '../../redux/reducers/rootReducer';
import useFetchRegistration from '../../utils/hooks/useFetchRegistration';
import useUppy from '../../utils/hooks/useUppy';
import { registrationValidationSchema } from '../../utils/validation/registration/registrationValidation';
import { PageHeader } from '../../components/PageHeader';
import Forbidden from '../errorpages/Forbidden';
import { RegistrationFormActions } from './RegistrationFormActions';

const StyledRegistration = styled.div`
  width: 100%;
`;

interface RegistrationFormProps {
  closeForm: () => void;
  identifier?: string;
}

const RegistrationForm: FC<RegistrationFormProps> = ({ identifier = '', closeForm }) => {
  const user = useSelector((store: RootStore) => store.user);
  const { t } = useTranslation('registration');
  const history = useHistory();
  const initialTabNumber = new URLSearchParams(history.location.search).get('tab');
  const [tabNumber, setTabNumber] = useState(initialTabNumber ? +initialTabNumber : RegistrationTab.Description);
  const [isSaving, setIsSaving] = useState(false);
  const dispatch = useDispatch();
  const uppy = useUppy();
  const [registration, isLoadingRegistration, handleSetRegistration] = useFetchRegistration(identifier);
  const isOwner = registration?.owner === user.id;

  useEffect(() => {
    if (!registration && !isLoadingRegistration) {
      closeForm();
    }
  }, [closeForm, registration, isLoadingRegistration]);

  useEffect(() => {
    if (registration) {
      // Redirect to public page if user should not be able to edit this registration
      const isValidOwner = user.isCreator && user.id === registration.owner;
      const isValidCurator = user.isCurator && user.customerId === registration.publisher.id;
      if (!isValidOwner && !isValidCurator) {
        history.push(`/registration/${registration.identifier}/public`);
      }
    }
  }, [history, registration, user]);

  const saveRegistration = async (values: Registration) => {
    setIsSaving(true);
    const updatedRegistration = await updateRegistration(values);
    if (updatedRegistration?.error) {
      dispatch(setNotification(updatedRegistration.error, NotificationVariant.Error));
    } else {
      handleSetRegistration(deepmerge(emptyRegistration, updatedRegistration));
      dispatch(setNotification(t('feedback:success.update_registration')));
    }
    setIsSaving(false);
    return !updatedRegistration.error;
  };

  const validateForm = (values: Registration) => {
    const {
      reference: { publicationContext },
    } = values.entityDescription;
    try {
      validateYupSchema<Registration>(values, registrationValidationSchema, true, {
        publicationContextType: publicationContext.type,
        publicationStatus: registration?.status,
      });
    } catch (err) {
      return yupToFormErrors(err);
    }
    return {};
  };

  return isLoadingRegistration ? (
    <CircularProgress />
  ) : !isOwner && !user.isCurator ? (
    <Forbidden />
  ) : (
    <>
      <PageHeader>{t('edit_registration')}</PageHeader>
      <StyledRegistration>
        <Formik
          enableReinitialize
          initialValues={registration ? deepmerge(emptyRegistration, registration) : emptyRegistration}
          validate={validateForm}
          onSubmit={() => {
            /* Use custom save handler instead, since onSubmit will prevent saving if there are any errors */
          }}>
          {({ dirty }: FormikProps<Registration>) => (
            <Form>
              <RouteLeavingGuard
                modalDescription={t('modal_unsaved_changes_description')}
                modalHeading={t('modal_unsaved_changes_heading')}
                shouldBlockNavigation={dirty}
              />
              <RegistrationFormTabs tabNumber={tabNumber} setTabNumber={setTabNumber} />
              <RegistrationFormContent tabNumber={tabNumber} uppy={uppy} />
              <RegistrationFormActions
                tabNumber={tabNumber}
                setTabNumber={setTabNumber}
                isSaving={isSaving}
                saveRegistration={saveRegistration}
              />
            </Form>
          )}
        </Formik>
      </StyledRegistration>
    </>
  );
};

export default RegistrationForm;
