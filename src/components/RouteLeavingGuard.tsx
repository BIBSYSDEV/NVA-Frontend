import { Location } from 'history';
import React, { useEffect, useState } from 'react';
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

  const handleBlockedNavigation = (nextLocation: Location): boolean => {
    const currentPath = `${history.location.pathname}${history.location.search}`;
    const newPath = `${nextLocation.pathname}${nextLocation.search}`;

    if (!confirmedNavigation && shouldBlockNavigation && currentPath !== newPath) {
      setShowModal(true);
      setNextLocation(nextLocation);
      return false;
    }
    return true;
  };

  const handleConfirmNavigationClick = () => {
    setShowModal(false);
    setConfirmedNavigation(true);
  };

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
  }, [confirmedNavigation, nextLocation, history]);

  return (
    <>
      <Prompt when={shouldBlockNavigation} message={handleBlockedNavigation} />
      <ConfirmDialog
        open={showModal}
        title={modalHeading}
        onAccept={handleConfirmNavigationClick}
        onCancel={() => setShowModal(false)}
        dataTestId="confirm-leaving-registration-form-dialog">
        <Typography>{modalDescription}</Typography>
      </ConfirmDialog>
    </>
  );
};
