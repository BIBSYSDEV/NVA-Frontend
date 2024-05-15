import { Box, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useUppy } from '@uppy/react';
import { Form, Formik, FormikProps } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { fetchRegistration } from '../../api/registrationApi';
import { fetchNviCandidateForRegistration } from '../../api/scientificIndexApi';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { PageHeader } from '../../components/PageHeader';
import { PageSpinner } from '../../components/PageSpinner';
import { RequiredDescription } from '../../components/RequiredDescription';
import { RouteLeavingGuard } from '../../components/RouteLeavingGuard';
import { SkipLink } from '../../components/SkipLink';
import { BackgroundDiv } from '../../components/styled/Wrappers';
import { Registration, RegistrationStatus, RegistrationTab } from '../../types/registration.types';
import { getTouchedTabFields, validateForm } from '../../utils/formik-helpers';
import { getTitleString, userCanEditRegistration } from '../../utils/registration-helpers';
import { createUppy } from '../../utils/uppy/uppy-config';
import { UrlPathTemplate } from '../../utils/urlPaths';
import { Forbidden } from '../errorpages/Forbidden';
import { ContributorsPanel } from './ContributorsPanel';
import { DescriptionPanel } from './DescriptionPanel';
import { FilesAndLicensePanel } from './FilesAndLicensePanel';
import { RegistrationFormActions } from './RegistrationFormActions';
import { RegistrationFormStepper } from './RegistrationFormStepper';
import { ResourceTypePanel } from './ResourceTypePanel';

export type HighestTouchedTab = RegistrationTab | -1;

export interface RegistrationLocationState {
  highestValidatedTab?: HighestTouchedTab;
}

interface RegistrationFormProps {
  identifier: string;
}

export const RegistrationForm = ({ identifier }: RegistrationFormProps) => {
  const { t, i18n } = useTranslation();
  const history = useHistory();
  const uppy = useUppy(createUppy(i18n.language));
  const [hasAcceptedNviWarning, setHasAcceptedNviWarning] = useState(false);

  const highestValidatedTab =
    useLocation<RegistrationLocationState>().state?.highestValidatedTab ?? RegistrationTab.FilesAndLicenses;

  const registrationQuery = useQuery({
    enabled: !!identifier,
    queryKey: ['registration', identifier],
    queryFn: () => fetchRegistration(identifier),
    meta: { errorMessage: t('feedback.error.get_registration') },
  });
  const registration = registrationQuery.data;
  const registrationId = registrationQuery.data?.id ?? '';
  const canHaveNviCandidate =
    registration?.status === RegistrationStatus.Published ||
    registration?.status === RegistrationStatus.PublishedMetadata;

  const nviCandidateQuery = useQuery({
    enabled: !!registrationId && canHaveNviCandidate,
    queryKey: ['nviCandidateForRegistration', registrationId],
    queryFn: () => fetchNviCandidateForRegistration(registrationId),
    retry: false,
    meta: { errorMessage: false },
  });

  const isNviCandidate =
    nviCandidateQuery.isSuccess && nviCandidateQuery.data.approvals.some((status) => status.status !== 'Pending');

  const initialTabNumber = new URLSearchParams(history.location.search).get('tab');
  const [tabNumber, setTabNumber] = useState(initialTabNumber ? +initialTabNumber : RegistrationTab.Description);

  const canEditRegistration = registration && userCanEditRegistration(registration);

  return registrationQuery.isPending || (canHaveNviCandidate && nviCandidateQuery.isPending) ? (
    <PageSpinner aria-label={t('common.result')} />
  ) : !canEditRegistration ? (
    <Forbidden />
  ) : registration ? (
    <>
      <SkipLink href="#form">{t('common.skip_to_schema')}</SkipLink>
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
              modalDescription={t('registration.modal_unsaved_changes_description')}
              modalHeading={t('registration.modal_unsaved_changes_heading')}
              shouldBlockNavigation={dirty}
            />
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
              <RegistrationFormActions
                tabNumber={tabNumber}
                setTabNumber={setTabNumber}
                validateForm={validateForm}
                persistedRegistration={registration}
                isNviCandidate={isNviCandidate}
              />
            </BackgroundDiv>
          </Form>
        )}
      </Formik>
      <ConfirmDialog
        open={isNviCandidate && !hasAcceptedNviWarning}
        title={t('registration.nvi_warning.registration_is_included_in_nvi')}
        onAccept={() => setHasAcceptedNviWarning(true)}
        onCancel={() => (history.length > 1 ? history.goBack() : history.push(UrlPathTemplate.Home))}>
        <Typography paragraph>{t('registration.nvi_warning.reset_nvi_warning')}</Typography>
        <Typography>{t('registration.nvi_warning.continue_editing_registration')}</Typography>
      </ConfirmDialog>
    </>
  ) : null;
};
