import { Box, Button, Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useFetchRegistration } from '../../../../api/hooks/useFetchRegistration';
import { updateRegistration } from '../../../../api/registrationApi';
import { MergeResultsWizard } from '../../../../components/merge_results/MergeResultsWizard';
import { setNotification } from '../../../../redux/notificationSlice';
import { RootState } from '../../../../redux/store';
import { Registration, RegistrationSearchItem } from '../../../../types/registration.types';
import { dataTestId } from '../../../../utils/dataTestIds';
import { getIdentifierFromId } from '../../../../utils/general-helpers';
import { updateRegistrationQueryData } from '../../../../utils/registration-helpers';
import { FindRegistration } from '../FindRegistration';

interface MergeRegistrationsProps {
  sourceRegistration: Registration;
}

export const MergeRegistrations = ({ sourceRegistration }: MergeRegistrationsProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const queryClient = useQueryClient();
  const [openDialog, setOpenDialog] = useState(false);
  const toggleDialog = () => setOpenDialog((prev) => !prev); // TODO: reset selected registration

  const targetRegistrationId = sourceRegistration.duplicateOf ?? '';
  const targetRegistrationQuery = useFetchRegistration(getIdentifierFromId(targetRegistrationId));

  const [selectedRegistration, setSelectedRegistration] = useState<RegistrationSearchItem | null>(null);
  const [targetRegistration, setTargetRegistration] = useState(targetRegistrationQuery.data);

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
          {targetRegistration ? (
            <MergeResultsWizard
              sourceResult={sourceRegistration}
              targetResult={targetRegistration}
              onSave={async (data) => await registrationMutation.mutateAsync(data)}
              onCancel={toggleDialog}
            />
          ) : (
            <>
              <Trans
                i18nKey="find_result_to_merge_description"
                components={{
                  p: <Typography gutterBottom />,
                  strong: <Typography component="strong" fontWeight="bold" />,
                }}
              />

              <FindRegistration
                setSelectedRegistration={(registration) => setSelectedRegistration(registration)}
                filteredRegistrationIdentifier={sourceRegistration.identifier}
                defaultSearchParams={user?.cristinId ? { contributor: getIdentifierFromId(user.cristinId) } : undefined}
              />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', mt: '1rem' }}>
                <Button onClick={toggleDialog}>{t('common.cancel')}</Button>
                <Button variant="contained" disabled={!selectedRegistration}>
                  {t('start_merging')}
                </Button>
              </Box>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};
