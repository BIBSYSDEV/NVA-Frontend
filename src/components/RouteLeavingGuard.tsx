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
  const [nextLocation, setNextLocation] = useState<Location | null>(null);
  const [confirmedNavigation, setConfirmedNavigation] = useState(false);
  const history = useHistory();

  const handleBlockedNavigation = (nextLocation: any): boolean => {
    if (!confirmedNavigation && shouldBlockNavigation) {
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
    if (confirmedNavigation && nextLocation) {
      history.push(nextLocation.pathname);
    }
  }, [confirmedNavigation, nextLocation, history]);

  return (
    <>
      <Prompt when={shouldBlockNavigation} message={handleBlockedNavigation} />
      <ConfirmDialog
        open={showModal}
        title={modalHeading}
        text={modalDescription}
        onAccept={handleConfirmNavigationClick}
        onCancel={() => setShowModal(false)}
      />
    </>
  );
};

export default RouteLeavingGuard;
