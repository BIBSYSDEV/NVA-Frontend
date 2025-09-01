import { Box, Button, Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { Registration, RegistrationSearchItem } from '../../../../types/registration.types';
import { dataTestId } from '../../../../utils/dataTestIds';
import { getIdentifierFromId } from '../../../../utils/general-helpers';
import { FindRegistration } from '../FindRegistration';
import { MergeSelectedRegistration } from './MergeSelectedRegistration';

interface MergeRegistrationsProps {
  sourceRegistration: Registration;
}

export const MergeRegistrations = ({ sourceRegistration }: MergeRegistrationsProps) => {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.user);
  const [openDialog, setOpenDialog] = useState(false);
  const toggleDialog = () => {
    setOpenDialog((prev) => !prev);
    setSelectedRegistration(null);
    setTargetRegistrationId(sourceRegistration.duplicateOf ?? '');
  };

  const [targetRegistrationId, setTargetRegistrationId] = useState(sourceRegistration.duplicateOf ?? '');
  const [selectedRegistration, setSelectedRegistration] = useState<RegistrationSearchItem | null>(null);

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
          {targetRegistrationId ? (
            <MergeSelectedRegistration
              targetRegistrationId={targetRegistrationId}
              sourceRegistration={sourceRegistration}
              toggleDialog={toggleDialog}
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
                <Button
                  variant="contained"
                  disabled={!selectedRegistration}
                  onClick={() => setTargetRegistrationId(selectedRegistration?.id ?? '')}>
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
