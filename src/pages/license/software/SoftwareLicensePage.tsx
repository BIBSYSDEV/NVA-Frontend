import { Divider, Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { HeadTitle } from '../../../components/HeadTitle';
import { OpenInNewLink } from '../../../components/OpenInNewLink';
import { BackgroundDiv } from '../../../components/styled/Wrappers';
import { licenses } from '../../../types/license.types';
import NotFound from '../../errorpages/NotFound';
import { LicenseRuleList } from './components/LicenseRuleList';
import { getSoftwareLicenseDeed } from './components/utils/software-license-helpers';

interface SoftwareLicenseParams extends Record<string, string> {
  spdxId: string;
}

/**
 * Norwegian guidance page for a software license, following the pattern of the Creative Commons
 * deeds: clicking the license name on a registration landing page opens this page. The content is
 * guidance for picking the right license — never a legally valid translation, which the disclaimer
 * states and the link to the official English text at the top backs up.
 *
 * The page is addressed by the SPDX identifier in {@link UrlPathTemplate.SoftwareLicense}. The
 * `-only` variants of the GPL family have no page of their own and link to the page of their
 * `-or-later` counterpart, whose version note explains the difference.
 */
const SoftwareLicensePage = () => {
  const { t } = useTranslation();
  const { spdxId } = useParams<SoftwareLicenseParams>();

  const deed = getSoftwareLicenseDeed(spdxId);
  const license = licenses.find((license) => license.spdxId === spdxId);

  if (!deed || !license) {
    return <NotFound />;
  }

  return (
    <BackgroundDiv sx={{ maxWidth: '45rem', my: '2rem' }}>
      <HeadTitle>{license.name}</HeadTitle>
      <Typography variant="h1" gutterBottom>
        {license.name}
      </Typography>

      <Typography sx={{ mb: '1rem' }}>
        {t('licenses.software.official_text')}{' '}
        <OpenInNewLink href={deed.officialTextUrl}>{deed.officialTextPublisher}</OpenInNewLink>
      </Typography>

      <Typography sx={{ mb: '1.5rem', bgcolor: 'info.light', borderRadius: '5px', p: '0.75rem' }}>
        {t('licenses.software.disclaimer')}
      </Typography>

      <LicenseRuleList title={t('licenses.software.permissions')} rules={deed.permissions} />
      <LicenseRuleList title={t('licenses.software.conditions')} rules={deed.conditions} />
      <LicenseRuleList title={t('licenses.software.limitations')} rules={deed.limitations} />

      <Typography component="h2" variant="h2" gutterBottom>
        {t('licenses.software.in_short')}
      </Typography>
      <Typography sx={{ mb: '1.5rem' }}>{deed.summary}</Typography>

      {deed.versionNote && (
        <>
          <Typography component="h2" variant="h2" gutterBottom>
            {t('licenses.software.version_note')}
          </Typography>
          <Typography sx={{ mb: '1.5rem' }}>{deed.versionNote}</Typography>
        </>
      )}

      <Divider sx={{ my: '1.5rem' }} />
      <Typography variant="body2">
        <Trans
          t={t}
          i18nKey="licenses.software.attribution"
          components={{
            chooseALicenseLink: <OpenInNewLink href="https://choosealicense.com/" />,
            ccByLink: <OpenInNewLink href="https://creativecommons.org/licenses/by/3.0/deed.no" />,
          }}
        />
      </Typography>
    </BackgroundDiv>
  );
};

export default SoftwareLicensePage;
