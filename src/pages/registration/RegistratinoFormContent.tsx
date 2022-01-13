import { Box } from '@mui/material';
import { useUppy } from '@uppy/react';
import { FormikProps, Form } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { BackgroundDiv } from '../../components/BackgroundDiv';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { ItalicPageHeader } from '../../components/PageHeader';
import { RequiredDescription } from '../../components/RequiredDescription';
import { RouteLeavingGuard } from '../../components/RouteLeavingGuard';
import { Registration, RegistrationTab } from '../../types/registration.types';
import { createUppy } from '../../utils/uppy/uppy-config';
import { ContributorsPanel } from './ContributorsPanel';
import { DescriptionPanel } from './DescriptionPanel';
import { FilesAndLicensePanel } from './FilesAndLicensePanel';
import { RegistrationFormActions } from './RegistrationFormActions';
import { RegistrationFormStepper } from './RegistrationFormStepper';
import { ResourceTypePanel } from './ResourceTypePanel';

interface RegistrationFormContentProps extends FormikProps<Registration> {
  refetchRegistration: () => void;
}

export const RegistrationFormContent = ({ values, dirty, refetchRegistration }: RegistrationFormContentProps) => {
  const { t, i18n } = useTranslation('registration');
  const history = useHistory();
  const uppy = useUppy(createUppy(i18n.language));

  const initialTabNumber = new URLSearchParams(history.location.search).get('tab');
  const [tabNumber, setTabNumber] = useState(initialTabNumber ? +initialTabNumber : RegistrationTab.Description);

  return (
    <Form noValidate>
      <RouteLeavingGuard
        modalDescription={t('modal_unsaved_changes_description')}
        modalHeading={t('modal_unsaved_changes_heading')}
        shouldBlockNavigation={dirty}
      />
      <ItalicPageHeader>{values.entityDescription?.mainTitle || `[${t('common:missing_title')}]`}</ItalicPageHeader>
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
  );
};
