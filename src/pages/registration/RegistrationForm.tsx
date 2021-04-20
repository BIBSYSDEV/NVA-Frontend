import deepmerge from 'deepmerge';
import { Form, Formik, FormikErrors, FormikProps, validateYupSchema, yupToFormErrors } from 'formik';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useUppy } from '@uppy/react';
import { RegistrationPageHeader } from '../../components/PageHeader';
import { PageSpinner } from '../../components/PageSpinner';
import RouteLeavingGuard from '../../components/RouteLeavingGuard';
import { RootStore } from '../../redux/reducers/rootReducer';
import { emptyRegistration, Registration, RegistrationTab } from '../../types/registration.types';
import useFetchRegistration from '../../utils/hooks/useFetchRegistration';
import { userIsRegistrationCurator, userIsRegistrationOwner } from '../../utils/registration-helpers';
import { createUppy } from '../../utils/uppy/uppy-config';
import { getRegistrationLandingPagePath } from '../../utils/urlPaths';
import { registrationValidationSchema } from '../../utils/validation/registration/registrationValidation';
import Forbidden from '../errorpages/Forbidden';
import { RegistrationFormActions } from './RegistrationFormActions';
import { RegistrationFormContent } from './RegistrationFormContent';
import { RegistrationFormTabs } from './RegistrationFormTabs';
import { getTouchedTabFields } from '../../utils/formik-helpers';
import { SkipLink } from '../../components/SkipLink';

const StyledRegistration = styled.div`
  width: 100%;
`;

export type HighestTouchedTab = RegistrationTab | -1;

export interface RegistrationLocationState {
  highestValidatedTab?: HighestTouchedTab;
}

interface RegistrationFormProps {
  identifier: string;
}

const RegistrationForm = ({ identifier }: RegistrationFormProps) => {
  const user = useSelector((store: RootStore) => store.user);
  const { t } = useTranslation('registration');
  const history = useHistory();
  const uppy = useUppy(createUppy());
  const highestValidatedTab =
    useLocation<RegistrationLocationState>().state?.highestValidatedTab ?? RegistrationTab.FilesAndLicenses;
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

  const validateForm = (values: Registration): FormikErrors<Registration> => {
    const {
      reference: { publicationContext, publicationInstance },
    } = values.entityDescription;
    try {
      validateYupSchema<Registration>(values, registrationValidationSchema, true, {
        publicationContextType: publicationContext.type,
        publicationInstanceType: publicationInstance.type,
        publicationStatus: registration?.status,
      });
    } catch (err) {
      return yupToFormErrors(err);
    }
    return {};
  };

  const initialValues = registration ? deepmerge(emptyRegistration, registration) : emptyRegistration;

  return isLoadingRegistration ? (
    <PageSpinner />
  ) : !isValidOwner && !isValidCurator ? (
    <Forbidden />
  ) : (
    <StyledRegistration>
      <SkipLink href="#form">{t('common:skip_to_schema')}</SkipLink>
      <Formik
        initialValues={initialValues}
        validate={validateForm}
        initialErrors={validateForm(initialValues)}
        initialTouched={getTouchedTabFields(highestValidatedTab, initialValues)}
        onSubmit={() => {
          /* Use custom save handler instead, since onSubmit will prevent saving if there are any errors */
        }}>
        {({ dirty, values }: FormikProps<Registration>) => (
          <Form noValidate>
            <RouteLeavingGuard
              modalDescription={t('modal_unsaved_changes_description')}
              modalHeading={t('modal_unsaved_changes_heading')}
              shouldBlockNavigation={dirty}
            />
            <RegistrationPageHeader>
              {values.entityDescription.mainTitle || `[${t('common:missing_title')}]`}
            </RegistrationPageHeader>
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
  );
};

export default RegistrationForm;
