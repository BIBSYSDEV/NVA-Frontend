import { Box } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useUppy } from '@uppy/react';
import { Form, Formik, FormikErrors, FormikProps, validateYupSchema, yupToFormErrors } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { fetchImportCandidate } from '../../../../api/registrationApi';
import { ErrorBoundary } from '../../../../components/ErrorBoundary';
import { PageHeader } from '../../../../components/PageHeader';
import { PageSpinner } from '../../../../components/PageSpinner';
import { RequiredDescription } from '../../../../components/RequiredDescription';
import { SkipLink } from '../../../../components/SkipLink';
import { BackgroundDiv } from '../../../../components/styled/Wrappers';
import { setNotification } from '../../../../redux/notificationSlice';
import { Registration, RegistrationTab } from '../../../../types/registration.types';
import { getTouchedTabFields } from '../../../../utils/formik-helpers';
import { getTitleString } from '../../../../utils/registration-helpers';
import { createUppy } from '../../../../utils/uppy/uppy-config';
import { IdentifierParams } from '../../../../utils/urlPaths';
import { registrationValidationSchema } from '../../../../utils/validation/registration/registrationValidation';
import { ContributorsPanel } from '../../../registration/ContributorsPanel';
import { DescriptionPanel } from '../../../registration/DescriptionPanel';
import { FilesAndLicensePanel } from '../../../registration/FilesAndLicensePanel';
import { RegistrationFormActions } from '../../../registration/RegistrationFormActions';
import { RegistrationFormStepper } from '../../../registration/RegistrationFormStepper';
import { ResourceTypePanel } from '../../../registration/ResourceTypePanel';

export type HighestTouchedTab = RegistrationTab | -1;

export interface RegistrationLocationState {
  highestValidatedTab?: HighestTouchedTab;
}

export const CentralImportCandidateForm = () => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const { identifier } = useParams<IdentifierParams>();
  const location = useLocation();
  const uppy = useUppy(createUppy(i18n.language));

  const registrationQuery = useQuery({
    queryKey: ['importCandidate', identifier],
    queryFn: () => fetchImportCandidate(identifier),
    onError: () => dispatch(setNotification({ message: t('feedback.error.get_import_candidate'), variant: 'error' })),
  });
  const registration = registrationQuery.data;

  const initialTabNumber = new URLSearchParams(location.search).get('tab');
  const [tabNumber, setTabNumber] = useState(initialTabNumber ? +initialTabNumber : RegistrationTab.Description);

  const validateForm = (values: Registration): FormikErrors<Registration> => {
    const publicationInstance = values.entityDescription?.reference?.publicationInstance;

    try {
      validateYupSchema<Registration>(values, registrationValidationSchema, true, {
        publicationInstanceType: publicationInstance?.type ?? '',
        publicationStatus: registration?.status,
      });
    } catch (err) {
      return yupToFormErrors(err);
    }
    return {};
  };

  // TODO: redirect if already imported

  return registrationQuery.isLoading ? (
    <PageSpinner aria-label={t('common.result')} />
  ) : registration ? (
    <>
      <SkipLink href="#form">{t('common.skip_to_schema')}</SkipLink>
      <Formik
        initialValues={registration}
        validate={validateForm}
        initialErrors={validateForm(registration)}
        initialTouched={getTouchedTabFields(RegistrationTab.FilesAndLicenses, registration)}
        onSubmit={() => {
          /* Use custom save handler instead, since onSubmit will prevent saving if there are any errors */
        }}>
        {({ values }: FormikProps<Registration>) => (
          <Form noValidate>
            <PageHeader variant="h1">{getTitleString(values.entityDescription?.mainTitle)}</PageHeader>
            <RegistrationFormStepper tabNumber={tabNumber} setTabNumber={setTabNumber} />
            <RequiredDescription />
            <BackgroundDiv sx={{ bgcolor: 'secondary.main' }}>
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
              <RegistrationFormActions tabNumber={tabNumber} setTabNumber={setTabNumber} validateForm={validateForm} />
            </BackgroundDiv>
          </Form>
        )}
      </Formik>
    </>
  ) : null;
};
