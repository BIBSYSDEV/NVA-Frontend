import { Button, Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useFetchRegistration } from '../../../api/hooks/useFetchRegistration';
import { MergeResultsWizard } from '../../../components/merge_results/MergeResultsWizard';
import { Registration } from '../../../types/registration.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { getIdentifierFromId } from '../../../utils/general-helpers';

interface MergeRegistrationsProps {
  sourceRegistration: Registration;
}

export const MergeRegistrations = ({ sourceRegistration }: MergeRegistrationsProps) => {
  const { t } = useTranslation();
  const [openDialog, setOpenDialog] = useState(false);

  const targetRegistrationId = sourceRegistration.duplicateOf ?? '';
  const targetRegistrationQuery = useFetchRegistration(getIdentifierFromId(targetRegistrationId));

  return (
    <section>
      <Trans
        i18nKey="merge_results_description"
        components={{ heading: <Typography fontWeight="bold" />, p: <Typography gutterBottom /> }}
      />
      <Button
        data-testid={dataTestId.registrationLandingPage.tasksPanel.mergeRegistrationsButton}
        variant="outlined"
        fullWidth
        size="small"
        sx={{ bgcolor: 'white' }}
        onClick={() => setOpenDialog(true)}>
        {t('merge_results')}
      </Button>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="lg" fullWidth>
        <DialogTitle>{t('merge_results')}</DialogTitle>
        <DialogContent>
          {targetRegistrationQuery.data && (
            <MergeResultsWizard
              sourceResult={sourceRegistration}
              targetResult={targetRegistrationQuery.data}
              onSave={(data) => {
                console.log('Save data:', data);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};
