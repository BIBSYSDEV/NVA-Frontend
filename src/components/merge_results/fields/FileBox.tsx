import LockIcon from '@mui/icons-material/Lock';
import { Box, BoxProps, Typography } from '@mui/material';
import prettyBytes from 'pretty-bytes';
import { useTranslation } from 'react-i18next';
import { FileUploaderInfo } from '../../../pages/public_registration/public_files/FileUploaderInfo';
import { AssociatedFile, FileVersion } from '../../../types/associatedArtifact.types';
import { toDateString } from '../../../utils/date-helpers';
import { getLicenseData } from '../../../utils/fileHelpers';
import { isEmbargoed } from '../../../utils/registration-helpers';

interface FileBoxProps extends BoxProps {
  file?: AssociatedFile;
  shouldShowFileVersion: boolean;
}

export const FileBox = ({ file, sx, shouldShowFileVersion }: FileBoxProps) => {
  const { t } = useTranslation();
  const licenseData = file ? getLicenseData(file.license) : null;

  return (
    <Box sx={{ p: '0.5rem', bgcolor: '#FEFBF3', height: '100%', minHeight: '5rem', ...sx }}>
      {file && (
        <>
          <Typography>
            <strong>{file.name}</strong>
          </Typography>
          <Typography>{prettyBytes(file.size, { locale: true })}</Typography>
          <FileUploaderInfo uploadDetails={file.uploadDetails} />
          <Box sx={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            {shouldShowFileVersion && (
              <>
                {file.publisherVersion === FileVersion.Published ? (
                  <Typography>{t('registration.files_and_license.published_version')}</Typography>
                ) : file.publisherVersion === FileVersion.Accepted ? (
                  <Typography>{t('registration.files_and_license.accepted_version')}</Typography>
                ) : null}
              </>
            )}

            {licenseData && (
              <Box sx={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                <Box
                  component="img"
                  alt={licenseData.name}
                  title={licenseData.name}
                  src={licenseData.logo}
                  sx={{ maxWidth: '5rem' }}
                />
                <Typography sx={{ textWrap: 'nowrap' }}>{licenseData.name}</Typography>
              </Box>
            )}
          </Box>
          {file.embargoDate && isEmbargoed(file.embargoDate) && (
            <Typography sx={{ display: 'flex', alignItems: 'center' }}>
              <LockIcon />
              {t('common.will_be_available')} {toDateString(file.embargoDate)}
            </Typography>
          )}
        </>
      )}
    </Box>
  );
};
