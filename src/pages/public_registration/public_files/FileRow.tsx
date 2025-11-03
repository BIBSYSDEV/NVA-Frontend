import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LockIcon from '@mui/icons-material/Lock';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CircularProgress,
  Link,
  Typography,
} from '@mui/material';
import prettyBytes from 'pretty-bytes';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { downloadRegistrationFile } from '../../../api/fileApi';
import { setNotification } from '../../../redux/notificationSlice';
import { AssociatedFile, FileVersion } from '../../../types/associatedArtifact.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { toDateString } from '../../../utils/date-helpers';
import { getLicenseData, hasFileAccessRight } from '../../../utils/fileHelpers';
import { isEmbargoed, openFileInNewTab } from '../../../utils/registration-helpers';
import { FileUploaderInfo } from './FileUploaderInfo';
import { PendingFilesInfo } from './PendingFilesInfo';
import { DownloadUrl, PreviewFile } from './preview_file/PreviewFile';

interface FileRowProps {
  file: AssociatedFile;
  registrationIdentifier: string;
  openPreviewByDefault: boolean;
  showFileVersionField: boolean;
  registrationMetadataIsPublished: boolean;
}

export const FileRow = ({
  file,
  registrationIdentifier,
  openPreviewByDefault,
  showFileVersionField,
  registrationMetadataIsPublished,
}: FileRowProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const canDownloadFile = hasFileAccessRight(file, 'download');

  const [openPreviewAccordion, setOpenPreviewAccordion] = useState(canDownloadFile && openPreviewByDefault);
  const [isLoadingPreviewFile, setIsLoadingPreviewFile] = useState(false);
  const [previewFileUrl, setPreviewFileUrl] = useState<DownloadUrl | null>(null);

  const handleDownload = useCallback(
    async (previewFile = false) => {
      if (!canDownloadFile) {
        dispatch(setNotification({ message: t('feedback.error.download_file'), variant: 'error' }));
        return;
      }
      if (previewFile) {
        setIsLoadingPreviewFile(true);
      }
      const downloadFileResponse = await downloadRegistrationFile(registrationIdentifier, file.identifier);
      if (!downloadFileResponse) {
        dispatch(setNotification({ message: t('feedback.error.download_file'), variant: 'error' }));
      } else {
        if (previewFile) {
          setPreviewFileUrl({
            id: downloadFileResponse.id,
            shortenedVersion: downloadFileResponse.alias,
          });
        } else {
          openFileInNewTab(downloadFileResponse.id);
        }
      }
      if (previewFile) {
        setIsLoadingPreviewFile(false);
      }
    },
    [t, dispatch, canDownloadFile, registrationIdentifier, file.identifier]
  );

  const fileIsEmbargoed = isEmbargoed(file.embargoDate);

  useEffect(() => {
    if (openPreviewAccordion && !previewFileUrl && canDownloadFile) {
      handleDownload(true); // Download file for preview
    }
  }, [handleDownload, openPreviewAccordion, previewFileUrl, canDownloadFile]);

  const licenseData = getLicenseData(file.license);
  const licenseTitle = licenseData?.name ?? '';

  const isOpenableFile = file.type === 'OpenFile' || file.type === 'PendingOpenFile';
  const isPendingFile = file.type === 'PendingOpenFile' || file.type === 'PendingInternalFile';
  const fileAwaitsApproval = registrationMetadataIsPublished && isPendingFile;

  return (
    <Box
      data-testid={dataTestId.registrationLandingPage.file}
      sx={{
        display: 'grid',
        gridTemplateAreas: {
          xs: `"name size" "version license" "note note" "download download"`,
          sm: `"name size version license download" "note note note note note" "preview preview preview preview preview"`,
        },
        gridTemplateColumns: { xs: '4fr 1fr', sm: '5fr 1fr auto 2fr 2fr' },
        gap: '0.5rem 0.75rem',
        alignItems: 'center',
        marginBottom: '2rem',
      }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
        <Typography
          data-testid={dataTestId.registrationLandingPage.fileName}
          sx={{ gridArea: 'name', fontSize: '1rem', fontWeight: 700, lineBreak: 'anywhere', minWidth: '6rem' }}>
          {file.name}
        </Typography>
        {fileAwaitsApproval && (
          <PendingFilesInfo
            text={
              <>
                <Typography>{t('registration.public_page.files.file_awaits_approval')}</Typography>
                <FileUploaderInfo uploadDetails={file.uploadDetails} />
              </>
            }
          />
        )}
      </Box>
      <Typography data-testid={dataTestId.registrationLandingPage.fileSize} sx={{ gridArea: 'size' }}>
        {prettyBytes(file.size, { locale: true })}
      </Typography>
      {showFileVersionField && (
        <Typography data-testid={dataTestId.registrationLandingPage.fileVersion} sx={{ gridArea: 'version' }}>
          {file.publisherVersion === FileVersion.Published
            ? t('registration.files_and_license.published_version')
            : file.publisherVersion === FileVersion.Accepted
              ? t('registration.files_and_license.accepted_version')
              : null}
        </Typography>
      )}

      {isOpenableFile && licenseData && (
        <Link
          href={licenseData.link}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ gridArea: 'license', maxHeight: '3rem' }}>
          {licenseData.logo ? (
            <Box
              component="img"
              alt={licenseTitle}
              title={licenseTitle}
              src={licenseData.logo}
              data-testid={dataTestId.registrationLandingPage.license}
              sx={{ maxWidth: '8rem' }}
            />
          ) : (
            licenseTitle
          )}
        </Link>
      )}

      <Box sx={{ gridArea: 'download' }}>
        {file.embargoDate && fileIsEmbargoed ? (
          <Typography
            data-testid={dataTestId.registrationLandingPage.fileEmbargoDate}
            sx={{ display: 'flex', alignItems: 'center' }}>
            <LockIcon />
            {t('common.will_be_available')} {toDateString(file.embargoDate)}
          </Typography>
        ) : canDownloadFile ? (
          <Button
            data-testid={dataTestId.registrationLandingPage.openFileButton}
            color="tertiary"
            variant="contained"
            fullWidth
            endIcon={<OpenInNewIcon />}
            onClick={() => handleDownload(false)}>
            {t('common.open')}
          </Button>
        ) : null}
      </Box>
      {file.legalNote && (
        <Typography sx={{ gridArea: 'note', bgcolor: 'info.light', borderRadius: '5px', p: '0.5rem' }}>
          {file.legalNote}
        </Typography>
      )}
      {canDownloadFile && (
        <Accordion
          sx={{ gridArea: 'preview', maxHeight: '35rem', display: { xs: 'none', sm: 'block' }, bgcolor: 'white' }}
          disableGutters
          variant="outlined"
          square
          expanded={openPreviewAccordion}
          onChange={() => setOpenPreviewAccordion(!openPreviewAccordion)}>
          <AccordionSummary id={`${file.identifier}-accordion-summary`} expandIcon={<ExpandMoreIcon />}>
            <Typography
              id={`preview-label-${file.identifier}`}
              data-testid={dataTestId.registrationLandingPage.filePreviewHeader}
              sx={{ fontWeight: 500, lineBreak: 'anywhere' }}>
              {t('registration.public_page.preview_of', { fileName: file.name })}
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ opacity: fileAwaitsApproval ? 0.7 : 1 }}>
            {isLoadingPreviewFile ? (
              <CircularProgress aria-labelledby={`preview-label-${file.identifier}`} />
            ) : (
              previewFileUrl && <PreviewFile url={previewFileUrl} file={file} />
            )}
          </AccordionDetails>
        </Accordion>
      )}
    </Box>
  );
};
