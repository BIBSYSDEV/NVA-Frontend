import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Ticket } from '../../../types/publication_types/ticket.types';
import { dataTestId } from '../../../utils/dataTestIds';

interface UpdateTicketOwnershipProps {
  ticket: Ticket;
}

export const UpdateTicketOwnership = ({ ticket }: UpdateTicketOwnershipProps) => {
  const { t } = useTranslation();

  const [showUpdateOwnershipDialog, setShowUpdateOwnershipDialog] = useState(false);
  const toggleUpdateOwnershipDialog = () => setShowUpdateOwnershipDialog(!showUpdateOwnershipDialog);

  return (
    <section>
      <Typography fontWeight="bold">{t('registration.public_page.tasks_panel.move_task')}</Typography>
      <Trans
        i18nKey="registration.public_page.tasks_panel.move_task_description"
        components={{ p: <Typography gutterBottom /> }}
      />
      <Button
        data-testid={dataTestId.registrationLandingPage.tasksPanel.updateTicketOwnershipButton}
        sx={{ bgcolor: 'white' }}
        size="small"
        fullWidth
        variant="outlined"
        onClick={toggleUpdateOwnershipDialog}>
        {t('registration.public_page.tasks_panel.move_task')}
      </Button>

      <Dialog open={showUpdateOwnershipDialog} maxWidth="sm" fullWidth onClose={toggleUpdateOwnershipDialog}>
        <DialogTitle>{t('registration.public_page.tasks_panel.move_task')}</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>{t('registration.public_page.tasks_panel.move_task_dialog_description')}</Typography>
        </DialogContent>
        <DialogActions>
          <Button data-testid={dataTestId.common.cancel} onClick={toggleUpdateOwnershipDialog}>
            {t('common.cancel')}
          </Button>
          <Button
            data-testid={dataTestId.common.save}
            variant="contained"
            onClick={() => {
              // TODO
            }}>
            {t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </section>
  );
};
