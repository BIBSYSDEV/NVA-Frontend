import {
  Box,
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Link,
} from '@mui/material';
import prettyBytes from 'pretty-bytes';
import { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import LockIcon from '@mui/icons-material/Lock';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { downloadPrivateFile, downloadPublicFile } from '../../../api/fileApi';
import { setNotification } from '../../../redux/notificationSlice';
import { RootState } from '../../../redux/store';
import { AssociatedFile } from '../../../types/associatedArtifact.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { PreviewFile } from './preview_file/PreviewFile';
import { equalUris } from '../../../utils/general-helpers';
import { licenses } from '../../../types/license.types';
import { isEmbargoed } from '../../../utils/registration-helpers';

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
  const user = useSelector((store: RootState) => store.user);
  const [openPreviewAccordion, setOpenPreviewAccordion] = useState(openPreviewByDefault);
  const [isLoadingPreviewFile, setIsLoadingPreviewFile] = useState(false);
  const [previewFileUrl, setPreviewFileUrl] = useState('');

  const handleDownload = useCallback(
    async (previewFile = false) => {
      previewFile && setIsLoadingPreviewFile(true);
      const downloadFileResponse = user
        ? await downloadPrivateFile(registrationIdentifier, file.identifier)
        : await downloadPublicFile(registrationIdentifier, file.identifier);
      if (!downloadFileResponse) {
        dispatch(setNotification({ message: t('feedback.error.download_file'), variant: 'error' }));
      } else {
        if (previewFile) {
          setPreviewFileUrl(downloadFileResponse.id);
        } else {
          window.open(downloadFileResponse.id, '_blank');
        }
      }
      previewFile && setIsLoadingPreviewFile(false);
    },
    [t, dispatch, user, registrationIdentifier, file.identifier]
  );

  const fileIsEmbargoed = isEmbargoed(file.embargoDate);

  useEffect(() => {
    if (openPreviewAccordion && !previewFileUrl && !fileIsEmbargoed) {
      handleDownload(true); // Download file for preview
    }
  }, [handleDownload, openPreviewAccordion, previewFileUrl, fileIsEmbargoed]);

  const licenseData = licenses.find((license) => equalUris(license.id, file.license));
  const licenseTitle = licenseData?.name ?? '';

  return (
    <Box
      data-testid={dataTestId.registrationLandingPage.file}
      sx={{
        display: 'grid',
        gridTemplateAreas: {
          xs: `"name size" "version license" "download download"`,
          sm: `"name size version license download" "preview preview preview preview preview"`,
        },
        gridTemplateColumns: { xs: '4fr 1fr', sm: '5fr 1fr auto 2fr 2fr' },
        rowGap: { xs: '1rem', sm: 0 },
        columnGap: '1rem',
        alignItems: 'center',
        marginBottom: '2rem',
        opacity: registrationMetadataIsPublished && file.type === 'UnpublishedFile' ? 0.6 : 1,
      }}>
      <Typography
        data-testid={dataTestId.registrationLandingPage.fileName}
        sx={{ gridArea: 'name', fontSize: '1rem', fontWeight: 700, lineBreak: 'anywhere' }}>
        {file.name}
      </Typography>
      <Typography data-testid={dataTestId.registrationLandingPage.fileSize} sx={{ gridArea: 'size' }}>
        {prettyBytes(file.size, { locale: true })}
      </Typography>
      {showFileVersionField && (
        <Typography data-testid={dataTestId.registrationLandingPage.fileVersion} sx={{ gridArea: 'version' }}>
          {file.publisherAuthority
            ? t('registration.files_and_license.published_version')
            : t('registration.files_and_license.accepted_version')}
        </Typography>
      )}

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

      <Box sx={{ gridArea: 'download' }}>
        {file.embargoDate && fileIsEmbargoed ? (
          <Typography data-testid={dataTestId.registrationLandingPage.fileEmbargoDate}>
            <LockIcon />
            {t('common.will_be_available')} {new Date(file.embargoDate).toLocaleDateString()}
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
      {!fileIsEmbargoed && (
        <Accordion
          sx={{
            gridArea: 'preview',
            marginTop: '1rem',
            maxHeight: '35rem',
            display: { xs: 'none', sm: 'block' },
          }}
          variant="outlined"
          square
          expanded={openPreviewAccordion}
          onChange={() => setOpenPreviewAccordion(!openPreviewAccordion)}>
          <AccordionSummary id={`${file.identifier}-accordion-summary`} expandIcon={<ExpandMoreIcon />}>
            <Typography
              id={`preview-label-${file.identifier}`}
              data-testid={dataTestId.registrationLandingPage.filePreviewHeader}
              sx={{ fontWeight: 500 }}>
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
