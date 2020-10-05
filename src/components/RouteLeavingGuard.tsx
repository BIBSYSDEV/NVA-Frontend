import React, { useEffect, useState, FC } from 'react';
import { Prompt, useHistory } from 'react-router-dom';
import { Location } from 'history';
import ConfirmDialog from './ConfirmDialog';
import NormalText from './NormalText';

interface RouteLeavingGuardProps {
  modalDescription: string;
  modalHeading: string;
  shouldBlockNavigation: boolean;
}
const RouteLeavingGuard: FC<RouteLeavingGuardProps> = ({ modalDescription, modalHeading, shouldBlockNavigation }) => {
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
        <NormalText>{modalDescription}</NormalText>
      </ConfirmDialog>
    </>
  );
};

export default RouteLeavingGuard;
