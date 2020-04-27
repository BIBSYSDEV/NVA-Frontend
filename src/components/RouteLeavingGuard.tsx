import { Location } from 'history';
import React, { useEffect, useState, FC } from 'react';
import { Prompt } from 'react-router-dom';
import ConfirmDialog from './ConfirmDialog';

interface RouteLeavingGuardProps {
  modalDescription: string;
  modalHeading: string;
  navigate: (path: string) => void;
  shouldBlockNavigation: boolean;
  when?: boolean | undefined;
}
const RouteLeavingGuard: FC<RouteLeavingGuardProps> = ({
  modalDescription,
  modalHeading,
  navigate,
  shouldBlockNavigation,
  when,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [lastLocation, setLastLocation] = useState<Location | null>(null);
  const [confirmedNavigation, setConfirmedNavigation] = useState(false);

  const handleBlockedNavigation = (nextLocation: Location): boolean => {
    if (!confirmedNavigation && shouldBlockNavigation) {
      setModalVisible(true);
      setLastLocation(nextLocation);
      return false;
    }
    return true;
  };

  const handleConfirmNavigationClick = () => {
    setModalVisible(false);
    setConfirmedNavigation(true);
  };

  useEffect(() => {
    if (confirmedNavigation && lastLocation) {
      // Navigate to the previous blocked location with your navigate function
      navigate(lastLocation.pathname);
    }
  }, [confirmedNavigation, lastLocation, navigate]);

  return (
    <>
      <Prompt when={when} message={handleBlockedNavigation} />
      <ConfirmDialog
        open={modalVisible}
        title={modalHeading}
        text={modalDescription}
        onAccept={handleConfirmNavigationClick}
        onCancel={() => setModalVisible(false)}
      />
    </>
  );
};

export default RouteLeavingGuard;
