import { useCallback, useEffect, useState } from 'react';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import LockIcon from '@mui/icons-material/Lock';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CircularProgress,
  Typography,
} from '@mui/material';
import prettyBytes from 'pretty-bytes';
import { File, licenses } from '../../types/file.types';
import { downloadPrivateFile, downloadPublicFile } from '../../api/fileApi';
import { setNotification } from '../../redux/actions/notificationActions';
import { PublicRegistrationContentProps } from './PublicRegistrationContent';
import { PreviewFile } from './preview_file/PreviewFile';
import { dataTestId } from '../../utils/dataTestIds';
import { RootStore } from '../../redux/reducers/rootReducer';

const maxFileSize = 10000000; //10 MB

export const PublicFilesContent = ({ registration }: PublicRegistrationContentProps) => {
  const files = registration.fileSet?.files ?? [];
  const publiclyAvailableFiles = files.filter((file) => !file.administrativeAgreement);

  return (
    <>
      {publiclyAvailableFiles.map((file, index) => (
        <FileRow
          key={file.identifier}
          file={file}
          registrationIdentifier={registration.identifier}
          openPreviewByDefault={index === 0 && publiclyAvailableFiles[0].size < maxFileSize}
        />
      ))}
    </>
  );
};

interface FileRowProps {
  file: File;
  registrationIdentifier: string;
  openPreviewByDefault: boolean;
}

const FileRow = ({ file, registrationIdentifier, openPreviewByDefault }: FileRowProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation('common');
  const user = useSelector((store: RootStore) => store.user);
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
        dispatch(setNotification(t('feedback:error.download_file'), 'error'));
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
  const licenseTitle = file.license?.identifier ? t(`licenses:labels.${file.license.identifier}`) : '';

  return (
    <Box
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
          ? t('registration:files_and_license.published_version')
          : t('registration:files_and_license.accepted_version')}
      </Typography>
      <Box
        component="img"
        sx={{ gridArea: 'license', cursor: 'pointer' }}
        onClick={() => {
          if (licenseData?.link) {
            window.open(licenseData.link);
          }
        }}
        alt={licenseTitle}
        title={licenseTitle}
        src={licenseData?.logo}
        data-testid={dataTestId.registrationLandingPage.license}
      />
      <Box sx={{ gridArea: 'download' }}>
        {fileIsEmbargoed ? (
          <Typography>
            <LockIcon />
            {t('will_be_available')} {fileEmbargoDate?.toLocaleDateString()}
          </Typography>
        ) : (
          <Button
            data-testid={dataTestId.registrationLandingPage.openFileButton}
            variant="contained"
            fullWidth
            endIcon={<OpenInNewIcon />}
            onClick={() => handleDownload(false)}>
            {t('open')}
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
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="button">{t('registration:public_page.preview')}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {isLoadingPreviewFile ? <CircularProgress /> : <PreviewFile url={previewFileUrl} file={file} />}
          </AccordionDetails>
        </Accordion>
      )}
    </Box>
  );
};
