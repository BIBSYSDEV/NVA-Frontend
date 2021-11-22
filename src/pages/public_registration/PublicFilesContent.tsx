import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import LockIcon from '@mui/icons-material/Lock';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Accordion, AccordionDetails, AccordionSummary, Button, CircularProgress, Typography } from '@mui/material';
import prettyBytes from 'pretty-bytes';
import { File, licenses } from '../../types/file.types';
import { downloadFile } from '../../api/fileApi';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import { PublicRegistrationContentProps } from './PublicRegistrationContent';
import { PreviewFile } from './preview_file/PreviewFile';
import { dataTestId } from '../../utils/dataTestIds';

const StyledFileRowContainer = styled.div`
  > :not(:last-child) {
    margin-bottom: 1rem;
  }
`;

const StyledFileRow = styled.div`
  display: grid;
  grid-template-areas:
    'name     size    version license download'
    'preview  preview preview preview preview ';
  grid-template-columns: 5fr 1fr 2fr 2fr 2fr;
  column-gap: 1rem;
  align-items: center;
  padding: 1rem;
  background: ${({ theme }) => theme.palette.section.megaLight};

  @media (max-width: ${({ theme }) => `${theme.breakpoints.values.sm}px`}) {
    grid-template-areas:
      'name     size    '
      'version  license '
      'download download';
    grid-template-columns: auto auto;
    row-gap: 1rem;
  }
`;

const StyledFileName = styled(Typography)`
  grid-area: name;
  font-size: 1rem;
  font-weight: 700;
  line-break: anywhere;
`;

const StyledSize = styled(Typography)`
  grid-area: size;
`;

const StyledVersion = styled(Typography)`
  grid-area: version;
`;

const StyledLicenseImg = styled.img`
  grid-area: license;
  cursor: pointer;
`;

const StyledDownload = styled.div`
  grid-area: download;
`;

const StyledPreviewAccordion = styled(Accordion)`
  grid-area: preview;
  margin-top: 1rem;
  max-height: 35rem;
  background: #f6f6f6;

  @media (max-width: ${({ theme }) => `${theme.breakpoints.values.sm}px`}) {
    display: none;
  }
`;

const maxFileSize = 10000000; //10 MB

export const PublicFilesContent = ({ registration }: PublicRegistrationContentProps) => {
  const files = registration.fileSet?.files ?? [];
  const publiclyAvailableFiles = files.filter((file) => !file.administrativeAgreement);

  return (
    <StyledFileRowContainer>
      {publiclyAvailableFiles.map((file, index) => (
        <FileRow
          key={file.identifier}
          file={file}
          registrationIdentifier={registration.identifier}
          openPreviewByDefault={index === 0 && publiclyAvailableFiles[0].size < maxFileSize}
        />
      ))}
    </StyledFileRowContainer>
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
  const [openPreviewAccordion, setOpenPreviewAccordion] = useState(openPreviewByDefault);
  const [isLoadingPreviewFile, setIsLoadingPreviewFile] = useState(false);
  const [previewFileUrl, setPreviewFileUrl] = useState('');

  const handleDownload = useCallback(
    async (previewFile = false) => {
      previewFile && setIsLoadingPreviewFile(true);
      const downloadFileResponse = await downloadFile(registrationIdentifier, file.identifier);
      if (!downloadFileResponse) {
        dispatch(setNotification(t('feedback:error.download_file'), NotificationVariant.Error));
      } else {
        const { presignedDownloadUrl } = downloadFileResponse;
        if (previewFile) {
          setPreviewFileUrl(presignedDownloadUrl);
        } else {
          window.open(presignedDownloadUrl, '_blank');
        }
      }
      previewFile && setIsLoadingPreviewFile(false);
    },
    [t, dispatch, registrationIdentifier, file.identifier]
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
    <StyledFileRow>
      <StyledFileName>{file.name}</StyledFileName>
      <StyledSize>{prettyBytes(file.size, { locale: true })}</StyledSize>
      <StyledVersion>
        {file.publisherAuthority
          ? t('registration:files_and_license.published_version')
          : t('registration:files_and_license.accepted_version')}
      </StyledVersion>
      <StyledLicenseImg
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
      <StyledDownload>
        {fileIsEmbargoed ? (
          <Typography>
            <LockIcon />
            {t('will_be_available')} {fileEmbargoDate?.toLocaleDateString()}
          </Typography>
        ) : (
          <Button
            data-testid={dataTestId.registrationLandingPage.openFileButton}
            variant="contained"
            color="secondary"
            fullWidth
            endIcon={<OpenInNewIcon />}
            onClick={() => handleDownload(false)}>
            {t('open')}
          </Button>
        )}
      </StyledDownload>
      {!fileIsEmbargoed && (
        <StyledPreviewAccordion
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
        </StyledPreviewAccordion>
      )}
    </StyledFileRow>
  );
};
