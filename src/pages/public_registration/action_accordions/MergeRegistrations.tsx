import { Button, Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useFetchRegistration } from '../../../api/hooks/useFetchRegistration';
import { updateRegistration } from '../../../api/registrationApi';
import { MergeResultsWizard } from '../../../components/merge_results/MergeResultsWizard';
import { setNotification } from '../../../redux/notificationSlice';
import { Registration } from '../../../types/registration.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { getIdentifierFromId } from '../../../utils/general-helpers';
import { updateRegistrationQueryData } from '../../../utils/registration-helpers';

interface MergeRegistrationsProps {
  sourceRegistration: Registration;
}

export const MergeRegistrations = ({ sourceRegistration }: MergeRegistrationsProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [openDialog, setOpenDialog] = useState(false);
  const toggleDialog = () => setOpenDialog((prev) => !prev);

  const targetRegistrationId = sourceRegistration.duplicateOf ?? '';
  const targetRegistrationQuery = useFetchRegistration(getIdentifierFromId(targetRegistrationId));

  const registrationMutation = useMutation({
    mutationFn: (values: Registration) => updateRegistration(values),
    onError: () => dispatch(setNotification({ message: t('feedback.error.update_registration'), variant: 'error' })),
    onSuccess: (response) => {
      dispatch(setNotification({ message: t('feedback.success.update_registration'), variant: 'success' }));
      if (response.data) {
        updateRegistrationQueryData(queryClient, response.data);
      }
      toggleDialog();
    },
  });

  return (
    <section>
      <Trans
        t={t}
        i18nKey="merge_results_description"
        components={{ heading: <Typography fontWeight="bold" />, p: <Typography gutterBottom /> }}
      />
      <Button
        data-testid={dataTestId.registrationLandingPage.tasksPanel.mergeRegistrationsButton}
        variant="outlined"
        fullWidth
        size="small"
        sx={{ bgcolor: 'white' }}
        onClick={toggleDialog}>
        {t('merge_results')}
      </Button>

      <Dialog open={openDialog} onClose={toggleDialog} maxWidth="lg" fullWidth>
        <DialogTitle>{t('merge_results')}</DialogTitle>
        <DialogContent>
          {targetRegistrationQuery.data && (
            <MergeResultsWizard
              sourceResult={sourceRegistration}
              targetResult={targetRegistrationQuery.data}
              onSave={async (data) => await registrationMutation.mutateAsync(data)}
              onCancel={toggleDialog}
            />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};
