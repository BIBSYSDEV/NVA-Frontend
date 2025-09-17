import CheckIcon from '@mui/icons-material/Check';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { Box, BoxProps, Typography } from '@mui/material';
import prettyBytes from 'pretty-bytes';
import { useTranslation } from 'react-i18next';
import { FileUploaderInfo } from '../../../pages/public_registration/public_files/FileUploaderInfo';
import { PendingFilesInfo } from '../../../pages/public_registration/public_files/PendingFilesInfo';
import { DownloadFileButton } from '../../../pages/registration/files_and_license_tab/DownloadFileButton';
import { AssociatedFile, FileVersion } from '../../../types/associatedArtifact.types';
import { Registration } from '../../../types/registration.types';
import { toDateString } from '../../../utils/date-helpers';
import { getLicenseData } from '../../../utils/fileHelpers';
import { isEmbargoed } from '../../../utils/registration-helpers';

interface FileBoxProps extends BoxProps {
  file?: AssociatedFile;
  shouldShowFileVersion: boolean;
  /**
   * Pass the associated registration when the file should be downloadable.
   * A file can only be downloaded in the context of its registration.
   */
  registrationWithFile?: Registration;
}

export const FileBox = ({ file, sx, shouldShowFileVersion, registrationWithFile }: FileBoxProps) => {
  const { t } = useTranslation();
  const licenseData = file ? getLicenseData(file.license) : null;

  return (
    <Box
      sx={{
        p: '0.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
        bgcolor: '#FEFBF3',
        height: '100%',
        minHeight: '5rem',
        ...sx,
      }}>
      {file && (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Typography>
              <strong>{file.name}</strong>
            </Typography>
            {registrationWithFile && <DownloadFileButton file={file} registration={registrationWithFile} />}
          </Box>
          <Typography>{prettyBytes(file.size, { locale: true })}</Typography>
          <FileUploaderInfo uploadDetails={file.uploadDetails} />
          <Box sx={{ display: 'flex', gap: '0.5rem 2rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {(file.type === 'OpenFile' || file.type === 'PendingOpenFile') && (
              <Box sx={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                <CheckIcon fontSize="small" />
                {t('registration.files_and_license.file_type.open_file')}
              </Box>
            )}
            {(file.type === 'InternalFile' || file.type === 'PendingInternalFile') && (
              <Box sx={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                <Inventory2OutlinedIcon fontSize="small" />
                {t('registration.files_and_license.file_type.internal_file')}
              </Box>
            )}
            {file.type === 'HiddenFile' && (
              <Box sx={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                <VisibilityOffOutlinedIcon fontSize="small" />
                {t('registration.files_and_license.file_type.hidden_file')}
              </Box>
            )}

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
                <img alt="" title={licenseData.name} src={licenseData.logo} />
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

          {(file.type === 'PendingOpenFile' || file.type === 'PendingInternalFile') && (
            <PendingFilesInfo
              sx={{ width: 'fit-content' }}
              text={t('registration.public_page.files.file_awaits_approval')}
            />
          )}
        </>
      )}
    </Box>
  );
};
