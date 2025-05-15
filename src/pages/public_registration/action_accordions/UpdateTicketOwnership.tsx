import { Button, Typography } from '@mui/material';
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
        onClick={() => setShowUpdateOwnershipDialog(true)}>
        {t('registration.public_page.tasks_panel.move_task')}
      </Button>
    </section>
  );
};
