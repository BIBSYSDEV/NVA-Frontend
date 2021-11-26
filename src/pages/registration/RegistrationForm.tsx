import { Form, Formik, FormikErrors, FormikProps, validateYupSchema, yupToFormErrors } from 'formik';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { useUppy } from '@uppy/react';
import { ItalicPageHeader } from '../../components/PageHeader';
import { PageSpinner } from '../../components/PageSpinner';
import { RouteLeavingGuard } from '../../components/RouteLeavingGuard';
import { RootStore } from '../../redux/reducers/rootReducer';
import { Registration, RegistrationTab } from '../../types/registration.types';
import { userIsRegistrationCurator, userIsRegistrationOwner } from '../../utils/registration-helpers';
import { createUppy } from '../../utils/uppy/uppy-config';
import { getRegistrationLandingPagePath } from '../../utils/urlPaths';
import { registrationValidationSchema } from '../../utils/validation/registration/registrationValidation';
import { Forbidden } from '../errorpages/Forbidden';
import { RegistrationFormActions } from './RegistrationFormActions';
import { RegistrationFormStepper } from './RegistrationFormStepper';
import { getTouchedTabFields } from '../../utils/formik-helpers';
import { SkipLink } from '../../components/SkipLink';
import { useFetch } from '../../utils/hooks/useFetch';
import { PublicationsApiPath } from '../../api/apiPaths';
import { ContributorsPanel } from './ContributorsPanel';
import { DescriptionPanel } from './DescriptionPanel';
import { FilesAndLicensePanel } from './FilesAndLicensePanel';
import { ResourceTypePanel } from './ResourceTypePanel';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { BackgroundDiv } from '../../components/BackgroundDiv';
import { RequiredDescription } from '../../components/RequiredDescription';

export type HighestTouchedTab = RegistrationTab | -1;

export interface RegistrationLocationState {
  highestValidatedTab?: HighestTouchedTab;
}

interface RegistrationFormProps {
  identifier: string;
}

export const RegistrationForm = ({ identifier }: RegistrationFormProps) => {
  const user = useSelector((store: RootStore) => store.user);
  const { t } = useTranslation('registration');
  const history = useHistory();
  const uppy = useUppy(createUppy());
  const highestValidatedTab =
    useLocation<RegistrationLocationState>().state?.highestValidatedTab ?? RegistrationTab.FilesAndLicenses;
  const [registration, isLoadingRegistration, refetchRegistration] = useFetch<Registration>({
    url: `${PublicationsApiPath.Registration}/${identifier}`,
    errorMessage: t('feedback:error.get_registration'),
  });
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
    const publicationInstance = values.entityDescription?.reference?.publicationInstance;
    const contentType =
      publicationInstance && 'contentType' in publicationInstance ? publicationInstance.contentType : null;

    try {
      validateYupSchema<Registration>(values, registrationValidationSchema, true, {
        publicationInstanceType: publicationInstance?.type ?? '',
        publicationStatus: registration?.status,
        contentType,
      });
    } catch (err) {
      return yupToFormErrors(err);
    }
    return {};
  };

  return isLoadingRegistration ? (
    <PageSpinner />
  ) : !isValidOwner && !isValidCurator ? (
    <Forbidden />
  ) : registration ? (
    <>
      <SkipLink href="#form">{t('common:skip_to_schema')}</SkipLink>
      <Formik
        initialValues={registration}
        validate={validateForm}
        initialErrors={validateForm(registration)}
        initialTouched={getTouchedTabFields(highestValidatedTab, registration)}
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
            <ItalicPageHeader>
              {values.entityDescription?.mainTitle || `[${t('common:missing_title')}]`}
            </ItalicPageHeader>
            <RegistrationFormStepper tabNumber={tabNumber} setTabNumber={setTabNumber} />
            <RequiredDescription />
            <BackgroundDiv>
              <Box id="form" mb="2rem">
                {tabNumber === RegistrationTab.Description && (
                  <ErrorBoundary>
                    <DescriptionPanel />
                  </ErrorBoundary>
                )}
                {tabNumber === RegistrationTab.ResourceType && (
                  <ErrorBoundary>
                    <ResourceTypePanel />
                  </ErrorBoundary>
                )}
                {tabNumber === RegistrationTab.Contributors && (
                  <ErrorBoundary>
                    <ContributorsPanel />
                  </ErrorBoundary>
                )}
                {tabNumber === RegistrationTab.FilesAndLicenses && (
                  <ErrorBoundary>
                    <FilesAndLicensePanel uppy={uppy} />
                  </ErrorBoundary>
                )}
              </Box>
              <RegistrationFormActions
                tabNumber={tabNumber}
                setTabNumber={setTabNumber}
                refetchRegistration={refetchRegistration}
              />
            </BackgroundDiv>
          </Form>
        )}
      </Formik>
    </>
  ) : null;
};
