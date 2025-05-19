import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import { useQueries } from '@tanstack/react-query';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { fetchOrganization } from '../../../api/cristinApi';
import { Ticket } from '../../../types/publication_types/ticket.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { getLanguageString } from '../../../utils/translation-helpers';

interface UpdateTicketOwnershipProps {
  ticket: Ticket;
}

export const UpdateTicketOwnership = ({ ticket }: UpdateTicketOwnershipProps) => {
  const { t } = useTranslation();

  const [showUpdateOwnershipDialog, setShowUpdateOwnershipDialog] = useState(false);
  const toggleUpdateOwnershipDialog = () => setShowUpdateOwnershipDialog(!showUpdateOwnershipDialog);

  const allowedInstitutionIds = ticket.availableInstitutions ?? [];

  const organizationQueries = useQueries({
    queries: allowedInstitutionIds.map((orgId) => ({
      queryKey: ['organization', orgId],
      enabled: !!orgId,
      queryFn: () => fetchOrganization(orgId),
      meta: { errorMessage: t('feedback.error.get_institution') },
      staleTime: Infinity,
      gcTime: 1_800_000,
    })),
  });

  const isPending = organizationQueries.some((query) => query.isPending);
  const allowedOrganizations = isPending ? [] : organizationQueries.map((query) => query.data);

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
          <Typography sx={{ mb: '1rem' }}>
            {t('registration.public_page.tasks_panel.move_task_dialog_description')}
          </Typography>

          <Autocomplete
            options={allowedOrganizations}
            getOptionLabel={(option) => getLanguageString(option?.labels)}
            loading={!isPending}
            renderInput={(params) => <TextField {...params} label={t('common.select_institution')} />}
          />
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
