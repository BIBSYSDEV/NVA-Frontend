import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Link, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { getCustomUserAttributes } from '../api/authApi';
import { acceptTermsAndConditions } from '../api/roleApi';
import { LanguageSelector } from '../layout/header/LanguageSelector';
import { setNotification } from '../redux/notificationSlice';
import { setUser } from '../redux/userSlice';
import { dataTestId } from '../utils/dataTestIds';
import { useAuthentication } from '../utils/hooks/useAuthentication';

interface AcceptTermsDialogProps {
  newTermsUri: string;
}

export const AcceptTermsDialog = ({ newTermsUri }: AcceptTermsDialogProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { handleLogout } = useAuthentication();

  const acceptTermsMutation = useMutation({
    mutationFn: async () => {
      const acceptTermsResponse = await acceptTermsAndConditions(newTermsUri);
      if (acceptTermsResponse.data.termsConditionsUri) {
        const newSessionAttributes = await getCustomUserAttributes({ forceRefresh: true });
        if (newSessionAttributes) {
          dispatch(setUser(newSessionAttributes));
        }
      }
    },
    onError: () => dispatch(setNotification({ message: t('feedback.error.accept_terms'), variant: 'error' })),
  });

  return (
    <Dialog open={true}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        {t('authorization.welcome')} <LanguageSelector />
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ mb: '1rem' }}>{t('authorization.accept_terms_intro')} </Typography>
        <Typography variant="h3" gutterBottom>
          {t('authorization.about_terms')}
        </Typography>
        <Trans i18nKey="authorization.about_terms_description">
          <Typography sx={{ mb: '1rem' }}>
            <Link
              href="https://sikt.no/tjenester/nasjonalt-vitenarkiv-nva/brukervilkar-nasjonalt-vitenarkiv"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ display: 'inline-flex', alignItems: 'center' }}>
              <OpenInNewIcon fontSize="small" />
            </Link>
          </Typography>
          <Typography sx={{ textAlign: 'center' }} />
        </Trans>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button data-testid={dataTestId.confirmDialog.cancelButton} onClick={handleLogout}>
          {t('authorization.reject')}
        </Button>
        <Button
          data-testid={dataTestId.confirmDialog.acceptButton}
          loading={acceptTermsMutation.isPending}
          variant="contained"
          onClick={() => acceptTermsMutation.mutate()}>
          {t('authorization.accept')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
