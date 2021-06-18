import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import LockIcon from '@material-ui/icons/Lock';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Accordion, AccordionDetails, AccordionSummary, Button, CircularProgress, Typography } from '@material-ui/core';
import prettyBytes from 'pretty-bytes';
import { File, licenses } from '../../types/file.types';
import { downloadFile } from '../../api/fileApi';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import ButtonWithProgress from '../../components/ButtonWithProgress';
import { PublicRegistrationContentProps } from './PublicRegistrationContent';
import { PreviewFile } from './preview_file/PreviewFile';
import { dataTestId } from '../../utils/dataTestIds';

const StyledFileRowContainer = styled.div`
  width: 100%;
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
  background: ${({ theme }) => theme.palette.common.white};

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
  const publiclyAvailableFiles = registration.fileSet.files.filter((file) => !file.administrativeAgreement);

  return (
    <StyledFileRowContainer>
      {publiclyAvailableFiles.map((file, index) => (
        <FileRow
          key={file.identifier}
          file={file}
          registrationId={registration.identifier}
          openPreviewByDefault={index === 0 && publiclyAvailableFiles[0].size < maxFileSize}
        />
      ))}
    </StyledFileRowContainer>
  );
};

interface FileRowProps {
  file: File;
  registrationId: string;
  openPreviewByDefault: boolean;
}

const FileRow = ({ file, registrationId, openPreviewByDefault }: FileRowProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation('common');
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [currentFileUrl, setCurrentFileUrl] = useState('');
  const [openPreviewAccordion, setOpenPreviewAccordion] = useState(openPreviewByDefault);

  const handleDownload = useCallback(
    async (manuallyTriggered = true) => {
      setIsLoadingFile(true);
      const downloadedFile = await downloadFile(registrationId, file.identifier);
      if (!downloadedFile || downloadedFile?.error) {
        dispatch(setNotification(downloadedFile.error, NotificationVariant.Error));
      } else {
        setCurrentFileUrl(downloadedFile);
        if (manuallyTriggered) {
          window.open(downloadedFile, '_blank');
        }
      }
      setIsLoadingFile(false);
    },
    [dispatch, registrationId, file.identifier]
  );

  useEffect(() => {
    if (openPreviewAccordion && !currentFileUrl) {
      handleDownload(false); // Download file without user interaction
    }
  }, [handleDownload, currentFileUrl, openPreviewAccordion, file.size]);

  const licenseData = licenses.find((license) => license.identifier === file.license?.identifier);
  const fileEmbargoDate = file.embargoDate ? new Date(file.embargoDate) : null;
  const fileIsEmbargoed = fileEmbargoDate ? fileEmbargoDate > new Date() : false;

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
        onClick={() => window.open(licenseData?.link)}
        alt={file.license?.identifier}
        src={licenseData?.buttonImage}
      />
      <StyledDownload>
        {fileEmbargoDate && fileIsEmbargoed ? (
          <Typography>
            <LockIcon />
            {t('will_be_available')} {fileEmbargoDate.toLocaleDateString()}
          </Typography>
        ) : !currentFileUrl ? (
          <ButtonWithProgress
            data-testid={dataTestId.registrationLandingPage.downloadFileButton}
            variant="contained"
            color="secondary"
            fullWidth
            endIcon={<CloudDownloadIcon />}
            isLoading={isLoadingFile}
            onClick={handleDownload}>
            {t('download')}
          </ButtonWithProgress>
        ) : (
          <Button
            data-testid="button-open-file"
            variant="contained"
            color="secondary"
            fullWidth
            endIcon={<OpenInNewIcon />}
            href={currentFileUrl}>
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
            {isLoadingFile || !currentFileUrl ? <CircularProgress /> : <PreviewFile url={currentFileUrl} file={file} />}
          </AccordionDetails>
        </StyledPreviewAccordion>
      )}
    </StyledFileRow>
  );
};
