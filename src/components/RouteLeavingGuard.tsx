import { Location } from 'history';
import React, { useEffect, useState } from 'react';
import { Prompt } from 'react-router-dom';
import ConfirmDialog from './ConfirmDialog';
import { useTranslation } from 'react-i18next';

interface Props {
  when?: boolean | undefined;
  navigate: (path: string) => void;
  shouldBlockNavigation: (location: Location) => boolean;
}
const RouteLeavingGuard = ({ when, navigate, shouldBlockNavigation }: Props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [lastLocation, setLastLocation] = useState<Location | null>(null);
  const [confirmedNavigation, setConfirmedNavigation] = useState(false);
  const { t } = useTranslation('publication');

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleBlockedNavigation = (nextLocation: Location): boolean => {
    if (!confirmedNavigation && shouldBlockNavigation(nextLocation)) {
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
        title={t('modal_unsaved_changes_heading')}
        text={t('modal_unsaved_changes_description')}
        onAccept={handleConfirmNavigationClick}
        onCancel={closeModal}
      />
    </>
  );
};

export default RouteLeavingGuard;
