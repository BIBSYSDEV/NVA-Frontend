import { Button, Typography } from '@mui/material';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useUpdateRegistrationStatus } from '../../../api/hooks/useUpdateRegistrationStatus';
import { Registration } from '../../../types/registration.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { userCanRepublishRegistration } from '../../../utils/registration-helpers';

interface RepublishRegistrationProps {
  registration: Registration;
}

export const RepublishRegistration = ({ registration }: RepublishRegistrationProps) => {
  const { t } = useTranslation();
  const [openRepublishDialog, setOpenRepublishDialog] = useState(false);
  const toggleRepublishDialog = () => setOpenRepublishDialog(!openRepublishDialog);

  const updateRegistrationStatusMutation = useUpdateRegistrationStatus();

  const userCanRepublish = userCanRepublishRegistration(registration);

  return (
    <section>
      <Typography fontWeight="bold">{t('common.republish')}</Typography>

      {!userCanRepublish ? (
        <Trans
          t={t}
          i18nKey="registration.public_page.tasks_panel.no_access_to_republish"
          components={[<Typography gutterBottom key="1" />]}
        />
      ) : (
        <>
          <Trans
            t={t}
            i18nKey="registration.public_page.tasks_panel.republish_description"
            components={[<Typography gutterBottom key="1" />]}
          />
          <Button
            data-testid={dataTestId.registrationLandingPage.tasksPanel.republishRegistrationButton}
            variant="outlined"
            fullWidth
            size="small"
            sx={{ bgcolor: 'white' }}
            onClick={toggleRepublishDialog}>
            {t('common.republish')}
          </Button>
        </>
      )}
    </section>
  );
};
