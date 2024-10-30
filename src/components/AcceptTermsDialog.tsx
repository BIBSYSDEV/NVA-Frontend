import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  Link,
  Typography,
} from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { LanguageSelector } from '../layout/header/LanguageSelector';
import { useAuthentication } from '../utils/hooks/useAuthentication';

export const AcceptTermsDialog = (props: DialogProps) => {
  const { t } = useTranslation();
  const { handleLogout } = useAuthentication();

  return (
    <Dialog {...props} open={true}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {t('authorization.welcome')} <LanguageSelector />
      </DialogTitle>
      <DialogContent>
        <Typography paragraph>{t('authorization.accept_terms_intro')} </Typography>
        <Typography variant="h2" gutterBottom>
          {t('authorization.about_terms')}
        </Typography>
        <Trans t={t} i18nKey="authorization.about_terms_description">
          <Typography paragraph>
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
        <Button onClick={handleLogout}>{t('authorization.reject')}</Button>
        <Button variant="contained" onClick={() => console.log('accept terms')}>
          {t('authorization.accept')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
