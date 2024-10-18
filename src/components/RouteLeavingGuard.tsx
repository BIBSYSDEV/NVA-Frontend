import { Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Prompt, useHistory } from 'react-router-dom';
import { UrlPathTemplate } from '../utils/urlPaths';
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
  const [showModal, setShowModal] = useState(false);
  const [nextPath, setNextPath] = useState('');
  const [confirmedNavigation, setConfirmedNavigation] = useState(false);
  const history = useHistory();

  useEffect(() => {
    if (shouldBlockNavigation) {
      window.onbeforeunload = () => true;
      return () => {
        window.onbeforeunload = () => undefined;
      };
    }
  }, [shouldBlockNavigation]);

  useEffect(() => {
    if (confirmedNavigation && nextPath) {
      history.push(nextPath);
    }
  }, [history, confirmedNavigation, nextPath]);

  return (
    <>
      <Prompt
        when={shouldBlockNavigation}
        message={(nextLocation) => {
          const currentPath = `${history.location.pathname}${history.location.search}`;
          const newPath = `${nextLocation.pathname}${nextLocation.search}${nextLocation.hash}`;
          if (
            !confirmedNavigation &&
            shouldBlockNavigation &&
            currentPath !== newPath &&
            !goFromRegistrationWizardToLandingPage(history.location.pathname, nextLocation.pathname)
          ) {
            setShowModal(true);
            setNextPath(newPath);
            return false;
          }
          return true;
        }}
      />
      <ConfirmDialog
        open={showModal}
        title={modalHeading}
        onAccept={() => {
          setShowModal(false);
          setConfirmedNavigation(true);
        }}
        onCancel={() => setShowModal(false)}
        dialogDataTestId="confirm-leaving-registration-form-dialog">
        <Typography>{modalDescription}</Typography>
      </ConfirmDialog>
    </>
  );
};

// NOTE:
// This is a workaround to allow navigating to Landing Page programatically from Wizard, due to changes for React v18(?).
// This solution may lead to some unexpected behaviour, and should be revisited if we find a better solution.
const goFromRegistrationWizardToLandingPage = (currentPath: string, newPath: string) => {
  const splittedPath = UrlPathTemplate.RegistrationWizard.split(':identifier');
  const currentPathIsRegistrationWizard =
    currentPath.startsWith(splittedPath[0]) && currentPath.endsWith(splittedPath[1]);
  const newPathIsLandingPage =
    currentPath.startsWith(newPath) && !newPath.endsWith(splittedPath[1]) && newPath !== UrlPathTemplate.Home;

  return currentPathIsRegistrationWizard && newPathIsLandingPage;
};
