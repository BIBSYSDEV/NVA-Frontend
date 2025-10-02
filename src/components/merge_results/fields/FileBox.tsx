import CheckIcon from '@mui/icons-material/Check';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { Box, BoxProps, styled, Typography } from '@mui/material';
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

const StyledIconLabelContainer = styled(Box)({
  display: 'flex',
  gap: '0.25rem',
  alignItems: 'center',
});

interface FileBoxProps extends BoxProps {
  file?: AssociatedFile;
  showFileVersion: boolean;
  /**
   * Pass the associated registration when the file should be downloadable.
   * A file can only be downloaded in the context of its registration.
   */
  associatedRegistration?: Registration;
}

export const FileBox = ({ file, sx, showFileVersion, associatedRegistration }: FileBoxProps) => {
  const { t } = useTranslation();
  const licenseData = file ? getLicenseData(file.license) : null;

  return (
    <Box
      sx={{
        p: '0.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
        bgcolor: 'background.paper',
        height: '100%',
        minHeight: '5rem',
        ...sx,
      }}>
      {file && (
        <>
          <StyledIconLabelContainer>
            <Typography sx={{ wordBreak: 'break-word' }}>
              <strong>{file.name}</strong>
            </Typography>
            {associatedRegistration && <DownloadFileButton file={file} registration={associatedRegistration} />}
          </StyledIconLabelContainer>
          <Typography>{prettyBytes(file.size, { locale: true })}</Typography>
          <FileUploaderInfo uploadDetails={file.uploadDetails} />

          <Box sx={{ display: 'flex', gap: '0.5rem 2rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {(file.type === 'OpenFile' || file.type === 'PendingOpenFile') && (
              <StyledIconLabelContainer>
                <CheckIcon fontSize="small" />
                <Typography>{t('registration.files_and_license.file_type.open_file')}</Typography>
              </StyledIconLabelContainer>
            )}
            {(file.type === 'InternalFile' || file.type === 'PendingInternalFile') && (
              <StyledIconLabelContainer>
                <Inventory2OutlinedIcon fontSize="small" />
                <Typography>{t('registration.files_and_license.file_type.internal_file')}</Typography>
              </StyledIconLabelContainer>
            )}
            {file.type === 'HiddenFile' && (
              <StyledIconLabelContainer>
                <VisibilityOffOutlinedIcon fontSize="small" />
                <Typography>{t('registration.files_and_license.file_type.hidden_file')}</Typography>
              </StyledIconLabelContainer>
            )}

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
              <StyledIconLabelContainer>
                <Box component="img" alt="" title={licenseData.name} src={licenseData.logo} sx={{ height: '1.5rem' }} />
                <Typography sx={{ whiteSpace: 'nowrap' }}>{licenseData.name}</Typography>
              </StyledIconLabelContainer>
            )}
          </Box>

          {file.embargoDate && isEmbargoed(file.embargoDate) && (
            <StyledIconLabelContainer>
              <LockIcon />
              <Typography>
                {t('common.will_be_available')} {toDateString(file.embargoDate)}
              </Typography>
            </StyledIconLabelContainer>
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
