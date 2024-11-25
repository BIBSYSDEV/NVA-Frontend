import { Box, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useUppy } from '@uppy/react';
import { Form, Formik, FormikProps } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { useFetchRegistration } from '../../api/hooks/useFetchRegistration';
import { fetchNviCandidateForRegistration } from '../../api/scientificIndexApi';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { PageHeader } from '../../components/PageHeader';
import { PageSpinner } from '../../components/PageSpinner';
import { RegistrationIconHeader } from '../../components/RegistrationIconHeader';
import { RequiredDescription } from '../../components/RequiredDescription';
import { RouteLeavingGuard } from '../../components/RouteLeavingGuard';
import { SkipLink } from '../../components/SkipLink';
import { BackgroundDiv } from '../../components/styled/Wrappers';
import { NviCandidateContext } from '../../context/NviCandidateContext';
import { RootState } from '../../redux/store';
import { RegistrationFormLocationState } from '../../types/locationState.types';
import { Registration, RegistrationStatus, RegistrationTab } from '../../types/registration.types';
import { getTouchedTabFields, validateRegistrationForm } from '../../utils/formik-helpers/formik-helpers';
import { isApprovedAndOpenNviCandidate } from '../../utils/nviHelpers';
import { getTitleString, userHasAccessRight } from '../../utils/registration-helpers';
import { createUppy } from '../../utils/uppy/uppy-config';
import { UrlPathTemplate } from '../../utils/urlPaths';
import { Forbidden } from '../errorpages/Forbidden';
import { ContributorsPanel } from './ContributorsPanel';
import { DescriptionPanel } from './DescriptionPanel';
import { FilesAndLicensePanel } from './FilesAndLicensePanel';
import { RegistrationFormActions } from './RegistrationFormActions';
import { RegistrationFormStepper } from './RegistrationFormStepper';
import { ResourceTypePanel } from './ResourceTypePanel';

interface RegistrationFormProps {
  identifier: string;
}

export const RegistrationForm = ({ identifier }: RegistrationFormProps) => {
  const { t, i18n } = useTranslation();
  const history = useHistory();
  const user = useSelector((state: RootState) => state.user);
  const uppy = useUppy(createUppy(i18n.language));
  const [hasAcceptedNviWarning, setHasAcceptedNviWarning] = useState(false);

  const highestValidatedTab =
    useLocation<RegistrationFormLocationState>().state?.highestValidatedTab ?? RegistrationTab.FilesAndLicenses;

  const registrationQuery = useFetchRegistration(identifier);
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
    nviCandidateQuery.data?.period.status === 'OpenPeriod' &&
    nviCandidateQuery.data.approvals.some(
      (approval) => approval.status === 'Approved' || approval.status === 'Rejected'
    );

  const initialTabNumber = new URLSearchParams(history.location.search).get('tab');
  const [tabNumber, setTabNumber] = useState(initialTabNumber ? +initialTabNumber : RegistrationTab.Description);

  const canEditRegistration = userHasAccessRight(registration, 'update');

  return registrationQuery.isPending || (canHaveNviCandidate && nviCandidateQuery.isPending) ? (
    <PageSpinner aria-label={t('common.result')} />
  ) : !canEditRegistration ? (
    <Forbidden />
  ) : registration ? (
    <NviCandidateContext.Provider
      value={{
        nviCandidate: nviCandidateQuery.data,
        disableNviCriticalFields:
          !!nviCandidateQuery.data && isApprovedAndOpenNviCandidate(nviCandidateQuery.data) && !user?.isNviCurator,
      }}>
      <SkipLink href="#form">{t('common.skip_to_schema')}</SkipLink>
      <Formik
        initialValues={registration}
        validate={validateRegistrationForm}
        initialErrors={validateRegistrationForm(registration)}
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
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <RegistrationIconHeader
                publicationInstanceType={values.entityDescription?.reference?.publicationInstance.type}
                publicationDate={values.entityDescription?.publicationDate}
                showYearOnly
              />
              <PageHeader variant="h1">{getTitleString(values.entityDescription?.mainTitle)}</PageHeader>
            </Box>
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
                validateForm={validateRegistrationForm}
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
    </NviCandidateContext.Provider>
  ) : null;
};
