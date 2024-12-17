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
import { licenses } from '../../../types/license.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { toDateString } from '../../../utils/date-helpers';
import { equalUris } from '../../../utils/general-helpers';
import { isEmbargoed, openFileInNewTab } from '../../../utils/registration-helpers';
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
  const [openPreviewAccordion, setOpenPreviewAccordion] = useState(openPreviewByDefault);
  const [isLoadingPreviewFile, setIsLoadingPreviewFile] = useState(false);
  const [previewFileUrl, setPreviewFileUrl] = useState<DownloadUrl | null>(null);

  const handleDownload = useCallback(
    async (previewFile = false) => {
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
    [t, dispatch, registrationIdentifier, file.identifier]
  );

  const fileIsEmbargoed = isEmbargoed(file.embargoDate);

  useEffect(() => {
    if (openPreviewAccordion && !previewFileUrl && !fileIsEmbargoed) {
      handleDownload(true); // Download file for preview
    }
  }, [handleDownload, openPreviewAccordion, previewFileUrl, fileIsEmbargoed]);

  const licenseData = licenses.find((license) => equalUris(license.id, file.license));
  const licenseTitle = licenseData?.name ?? '';

  const isOpenableFile = file.type === 'OpenFile' || file.type === 'PendingOpenFile';
  const isPendingFile = file.type === 'PendingOpenFile' || file.type === 'PendingInternalFile';

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
        opacity: registrationMetadataIsPublished && isPendingFile ? 0.6 : 1,
      }}>
      <Typography
        data-testid={dataTestId.registrationLandingPage.fileName}
        sx={{ gridArea: 'name', fontSize: '1rem', fontWeight: 700, lineBreak: 'anywhere', minWidth: '6rem' }}>
        {file.name}
      </Typography>
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

      {isOpenableFile && (
        <Link
          href={licenseData?.link}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ gridArea: 'license', maxHeight: '3rem', maxWidth: '8rem' }}>
          <Box
            component="img"
            alt={licenseTitle}
            title={licenseTitle}
            src={licenseData?.logo}
            data-testid={dataTestId.registrationLandingPage.license}
          />
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
        ) : (
          <Button
            data-testid={dataTestId.registrationLandingPage.openFileButton}
            variant="contained"
            fullWidth
            endIcon={<OpenInNewIcon />}
            onClick={() => handleDownload(false)}>
            {t('common.open')}
          </Button>
        )}
      </Box>
      {file.legalNote && (
        <Typography sx={{ gridArea: 'note', bgcolor: 'secondary.main', borderRadius: '5px', p: '0.5rem' }}>
          {file.legalNote}
        </Typography>
      )}
      {!fileIsEmbargoed && (
        <Accordion
          sx={{ gridArea: 'preview', maxHeight: '35rem', display: { xs: 'none', sm: 'block' } }}
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
          <AccordionDetails>
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
