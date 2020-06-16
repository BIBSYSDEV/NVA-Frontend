import React, { useEffect, useState, FC } from 'react';
import { Prompt, useHistory } from 'react-router-dom';
import ConfirmDialog from './ConfirmDialog';

interface RouteLeavingGuardProps {
  modalDescription: string;
  modalHeading: string;
  shouldBlockNavigation: boolean;
}
const RouteLeavingGuard: FC<RouteLeavingGuardProps> = ({ modalDescription, modalHeading, shouldBlockNavigation }) => {
  const [showModal, setShowModal] = useState(false);
  const [nextLocation, setNextLocation] = useState<string | null>(null);
  const [confirmedNavigation, setConfirmedNavigation] = useState(false);
  const history = useHistory();

  const handleBlockedNavigation = (nextLocation: any): boolean => {
    const currentLocation = history.location.pathname;
    const newLocation = nextLocation.pathname;
    if (!confirmedNavigation && shouldBlockNavigation && currentLocation !== newLocation) {
      setShowModal(true);
      setNextLocation(newLocation);
      return false;
    }
    return true;
  };

  const handleConfirmNavigationClick = () => {
    setShowModal(false);
    setConfirmedNavigation(true);
  };

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
        onCancel={() => setShowModal(false)}>
        {modalDescription}
      </ConfirmDialog>
    </>
  );
};

export default RouteLeavingGuard;
