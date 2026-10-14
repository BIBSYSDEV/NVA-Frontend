import { Box, Divider, Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { HeadTitle } from '../../components/HeadTitle';
import { OpenInNewLink } from '../../components/OpenInNewLink';
import { BackgroundDiv } from '../../components/styled/Wrappers';
import { licenses } from '../../types/license.types';
import NotFound from '../errorpages/NotFound';
import { LicenseRuleList } from './_components/LicenseRuleList';
import { getLicenseDeed, getLicenseGuidanceUrl, LicenseRuleGroup } from './license-deed-config';

interface LicenseDeedParams extends Record<string, string> {
  slug: string;
}

/**
 * Public, plain-language summary of one software license, linked from the license on a registration
 * landing page and from the license help modal in the registration wizard.
 */
const LicenseDeedPage = () => {
  const { t } = useTranslation();
  const { slug } = useParams<LicenseDeedParams>();

  const deed = getLicenseDeed(slug);
  const license = licenses.find(({ id }) => id === deed?.licenseId);

  if (!deed || !license) {
    return <NotFound />;
  }

  // A GPL-family deed covers both version scopes, so it is titled without the qualifier that tells the
  // menu entries apart.
  const title = license.shortName ?? license.name;

  return (
    <BackgroundDiv sx={{ maxWidth: '60rem', my: '2rem' }}>
      <HeadTitle>{title}</HeadTitle>
      <Typography variant="h1" gutterBottom>
        {title}
      </Typography>

      <OpenInNewLink href={deed.officialUrl}>{t('licenses.deed.official_license_text')}</OpenInNewLink>

      <Typography sx={{ mt: '1rem', fontStyle: 'italic' }}>{t('licenses.deed.disclaimer')}</Typography>

      <Divider sx={{ my: '1.5rem' }} />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: '1.5rem' }}>
        {Object.values(LicenseRuleGroup).map((group) =>
          deed[group].length > 0 ? <LicenseRuleList key={group} group={group} rules={deed[group]} /> : null
        )}
      </Box>

      <Typography component="h2" variant="h3" sx={{ mt: '1.5rem' }} gutterBottom>
        {t('licenses.deed.summary')}
      </Typography>
      <Trans t={t} defaults={license.description} components={{ p: <Typography gutterBottom /> }} />

      {deed.versionNote && (
        <>
          <Typography component="h2" variant="h3" sx={{ mt: '1.5rem' }} gutterBottom>
            {t('licenses.deed.version_scope')}
          </Typography>
          <Typography gutterBottom>{t(`licenses.deed.version_note.${deed.versionNote}`)}</Typography>
        </>
      )}

      <Divider sx={{ my: '1.5rem' }} />

      <Trans
        t={t}
        i18nKey="licenses.deed.attribution"
        components={{
          p: <Typography variant="body2" />,
          chooseALicenseLink: <OpenInNewLink href={getLicenseGuidanceUrl(deed.slug)} />,
          ccLink: <OpenInNewLink href="https://creativecommons.org/licenses/by/3.0/deed.no" />,
        }}
      />
    </BackgroundDiv>
  );
};

export default LicenseDeedPage;
