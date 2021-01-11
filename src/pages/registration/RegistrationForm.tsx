import React, { useEffect, useState } from 'react';
import {
  Form,
  Formik,
  FormikProps,
  yupToFormErrors,
  validateYupSchema,
  setNestedObjectValues,
  FormikTouched,
  FormikErrors,
} from 'formik';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import deepmerge from 'deepmerge';
import { CircularProgress } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useUppy } from '@uppy/react';

import { emptyRegistration, Registration, RegistrationTab } from '../../types/registration.types';
import { RegistrationFormTabs } from './RegistrationFormTabs';
import RouteLeavingGuard from '../../components/RouteLeavingGuard';
import { RegistrationFormContent } from './RegistrationFormContent';
import { RootStore } from '../../redux/reducers/rootReducer';
import useFetchRegistration from '../../utils/hooks/useFetchRegistration';
import { registrationValidationSchema } from '../../utils/validation/registration/registrationValidation';
import { PageHeader } from '../../components/PageHeader';
import Forbidden from '../errorpages/Forbidden';
import { RegistrationFormActions } from './RegistrationFormActions';
import { userIsRegistrationOwner, userIsRegistrationCurator } from '../../utils/registration-helpers';
import { getRegistrationLandingPagePath } from '../../utils/urlPaths';
import { createUppy } from '../../utils/uppy/uppy-config';

const StyledRegistration = styled.div`
  width: 100%;
`;

interface RegistrationFormProps {
  identifier: string;
  isNewRegistration: boolean;
}

const RegistrationForm = ({ identifier, isNewRegistration }: RegistrationFormProps) => {
  const user = useSelector((store: RootStore) => store.user);
  const { t } = useTranslation('registration');
  const history = useHistory();
  const uppy = useUppy(createUppy());
  const [registration, isLoadingRegistration, refetchRegistration] = useFetchRegistration(identifier);
  const initialTabNumber = new URLSearchParams(history.location.search).get('tab');
  const [tabNumber, setTabNumber] = useState(initialTabNumber ? +initialTabNumber : RegistrationTab.Description);
  const isValidOwner = userIsRegistrationOwner(user, registration);
  const isValidCurator = userIsRegistrationCurator(user, registration);

  useEffect(() => {
    // Redirect to Landing Page if user should not be able to edit this registration
    if (registration && !isValidOwner && !isValidCurator) {
      history.replace(getRegistrationLandingPagePath(registration.identifier));
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

  const initialValues = registration ? deepmerge(emptyRegistration, registration) : emptyRegistration;
  const intialErrors: FormikErrors<Registration> = isNewRegistration ? {} : validateForm(initialValues);
  const intialTouched: FormikTouched<Registration> = isNewRegistration ? {} : setNestedObjectValues(intialErrors, true);

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
          initialValues={initialValues}
          validate={validateForm}
          initialErrors={intialErrors}
          initialTouched={intialTouched}
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
