import { Button, Typography } from '@mui/material';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { useUpdateRegistrationStatus } from '../../../api/hooks/useUpdateRegistrationStatus';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { Registration } from '../../../types/registration.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { userHasAccessRight } from '../../../utils/registration-helpers';
import { doNotRedirectQueryParam } from '../../../utils/urlPaths';

export interface RepublishRegistrationProps {
  registration: Registration;
  registrationIsValid: boolean;
  refetchData: () => Promise<void>;
}

export const RepublishRegistration = ({
  registration,
  registrationIsValid,
  refetchData,
}: RepublishRegistrationProps) => {
  const { t } = useTranslation();
  const [openRepublishDialog, setOpenRepublishDialog] = useState(false);
  const toggleRepublishDialog = () => setOpenRepublishDialog(!openRepublishDialog);

  const [searchParams, setSearchParams] = useSearchParams();

  const updateRegistrationStatusMutation = useUpdateRegistrationStatus();

  const userCanRepublish = userHasAccessRight(registration, 'republish');

  return (
    <section>
      <Typography fontWeight="bold">{t('common.republish')}</Typography>

      {!userCanRepublish ? (
        <Trans
          i18nKey="registration.public_page.tasks_panel.no_access_to_republish"
          components={[<Typography gutterBottom key="1" />]}
        />
      ) : (
        <>
          <Typography gutterBottom>{t('registration.public_page.tasks_panel.republish_description')}</Typography>
          {!registrationIsValid && (
            <Typography color="error" gutterBottom>
              {t('registration.public_page.tasks_panel.fix_validation_errors_before_republishing')}
            </Typography>
          )}
          <Button
            data-testid={dataTestId.registrationLandingPage.tasksPanel.republishRegistrationButton}
            variant="contained"
            color="tertiary"
            fullWidth
            size="small"
            disabled={!registrationIsValid}
            onClick={toggleRepublishDialog}>
            {t('common.republish')}
          </Button>
          <ConfirmDialog
            open={openRepublishDialog}
            title={t('common.republish')}
            onAccept={async () => {
              await updateRegistrationStatusMutation.mutateAsync({
                registrationIdentifier: registration.identifier,
                updateStatusRequest: { type: 'RepublishPublicationRequest' },
              });
              await refetchData();
              if (searchParams.has(doNotRedirectQueryParam)) {
                setSearchParams((params) => {
                  params.delete(doNotRedirectQueryParam);
                  return params;
                });
              }
              toggleRepublishDialog();
            }}
            isLoading={updateRegistrationStatusMutation.isPending}
            confirmButtonLabel={t('common.republish')}
            cancelButtonLabel={t('common.cancel')}
            onCancel={toggleRepublishDialog}>
            {t('registration.public_page.tasks_panel.confirm_republish_description')}
          </ConfirmDialog>
        </>
      )}
    </section>
  );
};
