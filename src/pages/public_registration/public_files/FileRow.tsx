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
import { File, licenses } from '../../../types/file.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { PreviewFile } from './preview_file/PreviewFile';

interface FileRowProps {
  file: File;
  registrationIdentifier: string;
  openPreviewByDefault: boolean;
}

export const FileRow = ({ file, registrationIdentifier, openPreviewByDefault }: FileRowProps) => {
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

  useEffect(() => {
    if (openPreviewAccordion && !previewFileUrl) {
      handleDownload(true); // Download file for preview
    }
  }, [handleDownload, openPreviewAccordion, previewFileUrl]);

  const licenseData = licenses.find((license) => license.identifier === file.license?.identifier);
  const fileEmbargoDate = file.embargoDate ? new Date(file.embargoDate) : null;
  const fileIsEmbargoed = fileEmbargoDate ? fileEmbargoDate > new Date() : false;
  const licenseTitle = file.license?.identifier ? t(`licenses.labels.${file.license.identifier}`) : '';

  return (
    <Box
      data-testid={dataTestId.registrationLandingPage.file}
      sx={{
        display: 'grid',
        gridTemplateAreas: {
          xs: `"name size" "version license" "download download"`,
          sm: `"name size version license download" "preview preview preview preview preview"`,
        },
        gridTemplateColumns: { xs: '4fr 1fr', sm: '5fr 1fr 2fr 2fr 2fr' },
        rowGap: { xs: '1rem', sm: 0 },
        columnGap: '1rem',
        alignItems: 'center',
        marginBottom: '2rem',
        opacity: file.type === 'UnpublishedFile' ? 0.6 : 1,
      }}>
      <Typography
        data-testid={dataTestId.registrationLandingPage.fileName}
        sx={{ gridArea: 'name', fontSize: '1rem', fontWeight: 700, lineBreak: 'anywhere' }}>
        {file.name}
      </Typography>
      <Typography data-testid={dataTestId.registrationLandingPage.fileSize} sx={{ gridArea: 'size' }}>
        {prettyBytes(file.size, { locale: true })}
      </Typography>
      <Typography data-testid={dataTestId.registrationLandingPage.fileVersion} sx={{ gridArea: 'version' }}>
        {file.publisherAuthority
          ? t('registration.files_and_license.published_version')
          : t('registration.files_and_license.accepted_version')}
      </Typography>

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
        {fileIsEmbargoed ? (
          <Typography data-testid={dataTestId.registrationLandingPage.fileEmbargoDate}>
            <LockIcon />
            {t('common.will_be_available')} {fileEmbargoDate?.toLocaleDateString()}
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
            <Typography data-testid={dataTestId.registrationLandingPage.filePreviewHeader} sx={{ fontWeight: 500 }}>
              {t('registration.public_page.preview_of', { fileName: file.name })}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {isLoadingPreviewFile ? (
              <CircularProgress />
            ) : (
              previewFileUrl && <PreviewFile url={previewFileUrl} file={file} />
            )}
          </AccordionDetails>
        </Accordion>
      )}
    </Box>
  );
};
