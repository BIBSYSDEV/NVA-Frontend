import { Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { useUpdateRegistrationStatus } from '../../../api/hooks/useUpdateRegistrationStatus';
import { Registration } from '../../../types/registration.types';
import { userCanRepublishRegistration } from '../../../utils/registration-helpers';

interface RepublishRegistrationProps {
  registration: Registration;
}

export const RepublishRegistration = ({ registration }: RepublishRegistrationProps) => {
  const { t } = useTranslation();
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
        <Typography gutterBottom>TODO</Typography>
      )}
    </section>
  );
};
