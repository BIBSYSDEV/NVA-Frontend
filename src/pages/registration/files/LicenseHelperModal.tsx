import { Box, Link, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { licenses, LicenseUri } from '../../../types/license.types';
import { dataTestId } from '../../../utils/dataTestIds';

import { HelperTextModal } from '../HelperTextModal';

export const LicenseHelperModal = () => {
  const { t } = useTranslation();

  return (
    <HelperTextModal
      modalTitle={t('registration.files_and_license.licenses')}
      modalDataTestId={dataTestId.registrationWizard.files.licenseModal}
      buttonDataTestId={dataTestId.registrationWizard.files.licenseHelpButton}>
      <Typography paragraph>{t('registration.files_and_license.file_and_license_info')}</Typography>
      {licenses
        .filter(
          (license) =>
            license.version === 4 || license.id === LicenseUri.CC0 || license.id === LicenseUri.RightsReserved
        )
        .map((license) => (
          <Box key={license.id} sx={{ mb: '1rem', whiteSpace: 'pre-wrap' }}>
            <Typography variant="h3" gutterBottom>
              {license.name}
            </Typography>
            <Box component="img" src={license.logo} alt="" sx={{ width: '8rem' }} />
            <Typography paragraph>{license.description}</Typography>
            {license.link && (
              <Link href={license.link} target="blank">
                {license.link}
              </Link>
            )}
          </Box>
        ))}
    </HelperTextModal>
  );
};
