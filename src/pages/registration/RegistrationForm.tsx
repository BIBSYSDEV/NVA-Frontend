import React, { FC, useEffect, useState } from 'react';
import { Form, Formik, FormikProps, yupToFormErrors, validateYupSchema } from 'formik';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import deepmerge from 'deepmerge';
import { CircularProgress } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { emptyRegistration, Registration, RegistrationTab } from '../../types/registration.types';
import { RegistrationFormTabs } from './RegistrationFormTabs';
import RouteLeavingGuard from '../../components/RouteLeavingGuard';
import { RegistrationFormContent } from './RegistrationFormContent';
import { RootStore } from '../../redux/reducers/rootReducer';
import useFetchRegistration from '../../utils/hooks/useFetchRegistration';
import useUppy from '../../utils/hooks/useUppy';
import { registrationValidationSchema } from '../../utils/validation/registration/registrationValidation';
import { PageHeader } from '../../components/PageHeader';
import Forbidden from '../errorpages/Forbidden';
import { RegistrationFormActions } from './RegistrationFormActions';
import { userIsRegistrationOwner, userIsRegistrationCurator } from '../../utils/registration-helpers';

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
  const uppy = useUppy();
  const [registration, isLoadingRegistration, refetchRegistration] = useFetchRegistration(identifier);

  const initialTabNumber = new URLSearchParams(history.location.search).get('tab');
  const [tabNumber, setTabNumber] = useState(initialTabNumber ? +initialTabNumber : RegistrationTab.Description);
  const isValidOwner = userIsRegistrationOwner(user, registration);
  const isValidCurator = userIsRegistrationCurator(user, registration);

  useEffect(() => {
    if (!registration && !isLoadingRegistration) {
      closeForm();
    }
  }, [closeForm, registration, isLoadingRegistration]);

  useEffect(() => {
    // Redirect to public page if user should not be able to edit this registration
    if (registration && !isValidOwner && !isValidCurator) {
      history.push(`/registration/${registration.identifier}/public`);
    }
  }, [history, registration, isValidOwner, isValidCurator]);

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
  ) : !isValidOwner && !isValidCurator ? (
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
            <Form noValidate>
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
                refetchRegistration={refetchRegistration}
              />
            </Form>
          )}
        </Formik>
      </StyledRegistration>
    </>
  );
};

export default RegistrationForm;
