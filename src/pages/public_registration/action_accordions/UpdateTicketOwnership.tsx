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
import { useMutation, useQueries } from '@tanstack/react-query';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrganization } from '../../../api/cristinApi';
import { updateTicket } from '../../../api/registrationApi';
import { setNotification } from '../../../redux/notificationSlice';
import { RootState } from '../../../redux/store';
import { Organization } from '../../../types/organization.types';
import { Ticket } from '../../../types/publication_types/ticket.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { getLanguageString } from '../../../utils/translation-helpers';

interface UpdateTicketOwnershipProps {
  ticket: Ticket;
  refetchData: () => Promise<void>;
}

export const UpdateTicketOwnership = ({ ticket, refetchData }: UpdateTicketOwnershipProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const customer = useSelector((state: RootState) => state.customer);

  const [showUpdateOwnershipDialog, setShowUpdateOwnershipDialog] = useState(false);
  const toggleUpdateOwnershipDialog = () => setShowUpdateOwnershipDialog(!showUpdateOwnershipDialog);

  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);

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

  const changeTicketOwnership = useMutation({
    mutationFn: async (newInstitutionId: string) => {
      await updateTicket(ticket.id, {
        type: 'UpdateTicketOwnershipRequest',
        ownerAffiliation: newInstitutionId,
        responsibilityArea: newInstitutionId,
      });
      await refetchData();
    },
    onSuccess: () =>
      dispatch(setNotification({ message: t('feedback.success.ticket_ownership_updated'), variant: 'success' })),
    onError: () =>
      dispatch(setNotification({ message: t('feedback.error.ticket_ownership_update_failed'), variant: 'error' })),
  });

  const fetchOrganizationsIsPending = organizationQueries.some((query) => query.isPending);
  const allowedOrganizations = fetchOrganizationsIsPending ? [] : organizationQueries.map((query) => query.data);

  return (
    <section>
      <Typography fontWeight="bold">{t('registration.public_page.tasks_panel.move_task')}</Typography>
      <Trans
        t={t}
        i18nKey="registration.public_page.tasks_panel.move_task_description"
        components={{ p: <Typography gutterBottom /> }}
      />
      <Button
        data-testid={dataTestId.registrationLandingPage.tasksPanel.updateTicketOwnershipButton}
        size="small"
        fullWidth
        color="tertiary"
        variant="contained"
        onClick={toggleUpdateOwnershipDialog}>
        {t('registration.public_page.tasks_panel.move_task')}
      </Button>

      <Dialog open={showUpdateOwnershipDialog} maxWidth="sm" fullWidth onClose={toggleUpdateOwnershipDialog}>
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            if (selectedOrganization) {
              await changeTicketOwnership.mutateAsync(selectedOrganization.id);
              toggleUpdateOwnershipDialog();
            }
          }}>
          <DialogTitle>{t('registration.public_page.tasks_panel.move_task')}</DialogTitle>
          <DialogContent>
            <Typography sx={{ mb: '1rem' }}>
              {t('registration.public_page.tasks_panel.move_task_dialog_description')}
            </Typography>

            <Autocomplete
              disabled={fetchOrganizationsIsPending || changeTicketOwnership.isPending}
              options={allowedOrganizations}
              onChange={(_, value) => setSelectedOrganization(value ?? null)}
              getOptionDisabled={(option) => option?.id === customer?.cristinId}
              getOptionLabel={(option) => getLanguageString(option?.labels)}
              loading={fetchOrganizationsIsPending}
              renderInput={(params) => (
                <TextField
                  {...params}
                  data-testid={dataTestId.registrationLandingPage.tasksPanel.moveTicketToOrganizationTextField}
                  required
                  label={t('common.select_institution')}
                />
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button
              data-testid={dataTestId.common.cancel}
              disabled={changeTicketOwnership.isPending}
              onClick={toggleUpdateOwnershipDialog}>
              {t('common.cancel')}
            </Button>
            <Button
              data-testid={dataTestId.common.save}
              loading={changeTicketOwnership.isPending}
              variant="contained"
              type="submit">
              {t('registration.public_page.tasks_panel.move_task')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </section>
  );
};
