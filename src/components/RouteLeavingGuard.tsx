import { Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Prompt, useHistory } from 'react-router-dom';
import { ConfirmDialog } from './ConfirmDialog';
import { PreviousPathLocationState } from '../types/locationState.types';

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
  const history = useHistory<PreviousPathLocationState | undefined>();

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
      const { previousPath } = history.location.state ?? {};
      if (previousPath === nextPath) {
        history.goBack();
      } else {
        history.push(nextPath);
      }
    }
  }, [history, confirmedNavigation, nextPath]);

  return (
    <>
      <Prompt
        when={shouldBlockNavigation}
        message={(nextLocation) => {
          const currentPath = `${history.location.pathname}${history.location.search}`;
          const newPath = `${nextLocation.pathname}${nextLocation.search}${nextLocation.hash}`;
          if (!confirmedNavigation && shouldBlockNavigation && currentPath !== newPath) {
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
