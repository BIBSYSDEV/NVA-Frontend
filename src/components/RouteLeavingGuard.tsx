import { Location } from 'history';
import { useEffect, useState } from 'react';
import { Prompt, useHistory } from 'react-router-dom';
import { Typography } from '@mui/material';
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
  const [nextLocation, setNextLocation] = useState<Location>();
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
    if (confirmedNavigation && nextLocation) {
      history.push(nextLocation);
    }
  }, [history, confirmedNavigation, nextLocation]);

  return (
    <>
      <Prompt
        when={shouldBlockNavigation}
        message={(nextLocation) => {
          const currentPath = `${history.location.pathname}${history.location.search}`;
          const newPath = `${nextLocation.pathname}${nextLocation.search}`;

          if (!confirmedNavigation && shouldBlockNavigation && currentPath !== newPath) {
            setShowModal(true);
            setNextLocation(nextLocation);
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
        dataTestId="confirm-leaving-registration-form-dialog">
        <Typography>{modalDescription}</Typography>
      </ConfirmDialog>
    </>
  );
};
