import { Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useBlocker, useNavigate } from 'react-router-dom';
import { ConfirmDialog } from './ConfirmDialog';

interface RouteLeavingGuardProps {
  modalDescription: string;
  modalHeading: string;
  shouldBlockNavigation: boolean;
}

export const RouteLeavingGuard = ({
  modalDescription,
  modalHeading,
  shouldBlockNavigation,
}: RouteLeavingGuardProps) => {
  const [nextPath, setNextPath] = useState('');
  const [confirmedNavigation, setConfirmedNavigation] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (shouldBlockNavigation) {
      window.onbeforeunload = () => true;
      return () => {
        window.onbeforeunload = () => undefined;
      };
    }
  }, [shouldBlockNavigation]);

  const blocker = useBlocker(() => shouldBlockNavigation);

  const isBlocked = blocker.state === 'blocked';

  return (
    isBlocked && (
      <ConfirmDialog
        open={isBlocked}
        title={modalHeading}
        onAccept={() => {
          blocker.proceed();
          setConfirmedNavigation(true);
        }}
        onCancel={() => {
          blocker.reset();
        }}
        dialogDataTestId="confirm-leaving-registration-form-dialog">
        <Typography>{modalDescription}</Typography>
      </ConfirmDialog>
    )
  );
};

// NOTE:
// This is a workaround to allow navigating to Landing Page programatically from Wizard, due to changes for React v18(?).
// This solution may lead to some unexpected behaviour, and should be revisited if we find a better solution.
{
  /*
const goFromRegistrationWizardToLandingPage = (currentPath: string, newPath: string) => {
  const splittedPath = UrlPathTemplate.RegistrationWizard.split(':identifier');
  const currentPathIsRegistrationWizard =
    currentPath.startsWith(splittedPath[0]) && currentPath.endsWith(splittedPath[1]);
  const newPathIsLandingPage = currentPath.startsWith(newPath) && !newPath.endsWith(splittedPath[1]);

  return currentPathIsRegistrationWizard && newPathIsLandingPage;
}; */
}
