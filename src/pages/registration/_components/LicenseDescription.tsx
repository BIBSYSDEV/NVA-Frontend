import { Box, Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { OpenInNewLink } from '../../../components/OpenInNewLink';
import { LicenseInfo } from '../../../types/license.types';

interface LicenseDescriptionProps {
  license: LicenseInfo;
}

/**
 * One license card in the license help modal: logo, heading, what the license permits and requires,
 * and a link to the page explaining it.
 *
 * The heading uses {@link LicenseInfo.shortName} when the license has one, since the modal
 * does not list the -only variants and therefore needs no version qualifier. The "read more" link
 * keeps {@link LicenseInfo.name}, which names the exact variant.
 */
export const LicenseDescription = ({ license }: LicenseDescriptionProps) => {
  const { t } = useTranslation();

  return (
    <div>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem', mb: '0.5rem' }}>
        {license.logo && <img src={license.logo} alt="" style={{ width: '5rem' }} />}
        <Typography component="h2" variant="h3">
          {license.shortName ?? license.name}
        </Typography>
      </Box>
      <Trans
        t={t}
        defaults={license.description}
        components={{
          p: <Typography gutterBottom />,
          ul: <Box component="ul" sx={{ mt: 0, mb: '0.5rem' }} />,
          li: <li />,
        }}
      />
      {license.link && (
        <OpenInNewLink href={license.link}>
          {t('licenses.read_more_about_license', { license: license.name })}
        </OpenInNewLink>
      )}
      {license.additionalInformation && (
        <Trans
          t={t}
          defaults={license.additionalInformation}
          components={{
            p: <Typography sx={{ mt: '1rem' }} />,
            link1: <OpenInNewLink href="https://lovdata.no/lov/2018-06-15-40/" />,
          }}
        />
      )}
    </div>
  );
};
