import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Skeleton,
  TextField,
  Typography,
} from '@mui/material';
import { HTMLAttributes, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useFetchOrganization } from '../../../api/hooks/useFetchOrganization';
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

  const allowedInstitutions = ticket.availableInstitutions ?? [];

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

          <Autocomplete
            options={allowedInstitutions}
            getOptionLabel={(option) => option}
            // onChange={(_, value) => setSelectedCustomer(value)}
            // isOptionEqualToValue={(option, value) => option.id === value.id}
            // renderOption={({ key, ...props }, option) => {
            //   const organization = organizations && organizations.find((org) => org.id === option.cristinId);
            //   return organization ? (
            //     <OrganizationRenderOption key={organization.id} props={props} option={organization} />
            //   ) : (
            //     <li {...props} key={option.id}>
            //       <Typography fontWeight="bold">{option.displayName}</Typography>
            //     </li>
            //   );
            // }}
            renderOption={(props, option) => <OrganizationRenderOption key={option} props={props} option={option} />}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={t('project.search_for_institution')}
                slotProps={{ inputLabel: { 'aria-label': t('common.select_institution') } }}
              />
            )}
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

interface OrganizationRenderOptionProps {
  props: HTMLAttributes<HTMLLIElement>;
  option: string;
}

const OrganizationRenderOption = ({ props, option }: OrganizationRenderOptionProps) => {
  const organizationQuery = useFetchOrganization(option);

  return (
    <li {...props}>
      {organizationQuery.isPending ? (
        <Skeleton sx={{ width: '15rem' }} />
      ) : (
        getLanguageString(organizationQuery.data?.labels)
      )}
    </li>
  );
};
