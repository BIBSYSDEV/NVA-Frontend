import { Box, BoxProps, Typography } from '@mui/material';
import prettyBytes from 'pretty-bytes';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { FileUploaderInfo } from '../../../pages/public_registration/public_files/FileUploaderInfo';
import { AssociatedFile, FileVersion } from '../../../types/associatedArtifact.types';
import { getLicenseData } from '../../../utils/fileHelpers';
import { isCategoryWithFileVersion } from '../../../utils/registration-helpers';
import { MergeResultsWizardContext } from '../MergeResultsWizardContext';

interface FileBoxProps extends BoxProps {
  file?: AssociatedFile;
}

export const FileBox = ({ file, sx }: FileBoxProps) => {
  const { t } = useTranslation();
  const { sourceResult } = useContext(MergeResultsWizardContext);
  const showFileVersion = isCategoryWithFileVersion(
    sourceResult.entityDescription?.reference?.publicationInstance?.type // TODO: source vs target?
  );
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
            {showFileVersion && (
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
        </>
      )}
    </Box>
  );
};
