import { Location } from 'history';
import React, { useEffect, useState, FC } from 'react';
import { Prompt, useHistory } from 'react-router-dom';
import ConfirmDialog from './ConfirmDialog';

interface RouteLeavingGuardProps {
  modalDescription: string;
  modalHeading: string;
  shouldBlockNavigation: boolean;
}
const RouteLeavingGuard: FC<RouteLeavingGuardProps> = ({ modalDescription, modalHeading, shouldBlockNavigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [lastLocation, setLastLocation] = useState<Location | null>(null);
  const [confirmedNavigation, setConfirmedNavigation] = useState(false);
  const history = useHistory();

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
      history.push(lastLocation.pathname);
    }
  }, [confirmedNavigation, lastLocation, history]);

  return (
    <>
      <Prompt when={shouldBlockNavigation} message={handleBlockedNavigation} />
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
