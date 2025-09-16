import { Typography } from '@mui/material';
import { useEffect } from 'react';
import { useBlocker } from 'react-router';
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
  useEffect(() => {
    if (shouldBlockNavigation) {
      window.onbeforeunload = () => true;
      return () => {
        window.onbeforeunload = () => undefined;
      };
    }
  }, [shouldBlockNavigation]);

  const blocker = useBlocker(() => shouldBlockNavigation);

  const isBlocked = blocker.state === 'blocked';

  return (
    isBlocked && (
      <ConfirmDialog
        open={isBlocked}
        title={modalHeading}
        onAccept={() => {
          blocker.proceed();
        }}
        onCancel={() => {
          blocker.reset();
        }}
        dialogDataTestId="confirm-leaving-registration-form-dialog">
        <Typography>{modalDescription}</Typography>
      </ConfirmDialog>
    )
  );
};
