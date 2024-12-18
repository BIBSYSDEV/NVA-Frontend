import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Link, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { Trans, useTranslation } from 'react-i18next';
import { BackgroundDiv } from '../../../components/styled/Wrappers';

export const Terms = () => {
  const { t } = useTranslation();

  return (
    <BackgroundDiv>
      <Helmet>
        <title>{t('common.terms')}</title>
      </Helmet>
      <Typography variant="h1" gutterBottom>
        {t('common.terms')}
      </Typography>
      <Trans i18nKey="my_page.my_profile.terms_description">
        <Typography sx={{ mb: '1rem', maxWidth: '50rem' }}>
          <Link
            href="https://sikt.no/tjenester/nasjonalt-vitenarkiv-nva/brukervilkar-nasjonalt-vitenarkiv"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ display: 'inline-flex', alignItems: 'center' }}>
            <OpenInNewIcon fontSize="small" />
          </Link>
        </Typography>
      </Trans>
    </BackgroundDiv>
  );
};
