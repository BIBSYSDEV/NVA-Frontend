import React, { useState } from 'react';
import styled from 'styled-components';
import DescriptionIcon from '@material-ui/icons/DescriptionOutlined';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import LockIcon from '@material-ui/icons/Lock';
import { File, licenses } from '../../types/file.types';
import { downloadFile } from '../../api/fileApi';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import ButtonWithProgress from '../../components/ButtonWithProgress';
import {
  Button,
  Card,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import { PublicRegistrationContentProps } from './PublicRegistrationContent';

const StyledTableCell = styled(TableCell)`
  min-width: 11rem;
  font-size: 1rem;
  word-wrap: break-word;
`;

const StyledNameTableCell = styled(StyledTableCell)`
  font-weight: 700;
  max-width: 35rem;
`;

const StyledFilesContent = styled.div``;

const PublicRegistrationFile = ({ registration }: PublicRegistrationContentProps) => {
  const { identifier } = useParams<{ identifier: string }>();
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [currentFileUrl, setCurrentFileUrl] = useState('');

  const handleDownload = async (fileId: string) => {
    setIsLoadingFile(true);
    const file = await downloadFile(identifier, fileId);
    if (!file || file?.error) {
      dispatch(setNotification(file.error, NotificationVariant.Error));
    } else {
      setCurrentFileUrl(file);
    }
    setIsLoadingFile(false);
  };

  const publiclyAvailableFiles = registration.fileSet.files.filter((file) => !file.administrativeAgreement);

  return (
    <StyledFilesContent>
      <Typography variant="h4" component="h2" gutterBottom>
        {t('registration:files_and_license.files')}
      </Typography>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <StyledTableCell>{t('registration:files_and_license.title')}</StyledTableCell>
              <StyledTableCell>{t('size')}</StyledTableCell>
              <StyledTableCell>{t('version')}</StyledTableCell>
              <StyledTableCell>{t('registration:files_and_license.license')}</StyledTableCell>
              <StyledTableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {publiclyAvailableFiles.map((file) => (
              <TableRow key={file.identifier} hover>
                <StyledNameTableCell>{file.name}</StyledNameTableCell>
                <StyledTableCell>{Math.round(file.size / 1000)} kB</StyledTableCell>
                <StyledTableCell>
                  {file.publisherAuthority
                    ? t('registration:files_and_license.published_version')
                    : t('registration:files_and_license.accepted_version')}
                </StyledTableCell>
                <StyledTableCell>
                  <img
                    alt={file.license?.identifier}
                    src={licenses.find((license) => license.identifier === file.license?.identifier)?.buttonImage}
                  />
                </StyledTableCell>
                <StyledTableCell>
                  {file.embargoDate && new Date(file.embargoDate) > new Date() ? (
                    <Typography>
                      <LockIcon />
                      {t('will_be_available')} {new Date(file.embargoDate).toLocaleDateString()}
                    </Typography>
                  ) : (
                    <Button variant="contained" color="secondary" fullWidth endIcon={<CloudDownloadIcon />}>
                      {t('download')}
                    </Button>
                  )}
                </StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* <div>
        <StyledFileIcon />
        <NormalText>{file.name}</NormalText>
        {file.embargoDate && new Date(file.embargoDate) > new Date() ? (
          <StyledNormalText>
            <LockIcon />
            {t('will_be_available')} {new Date(file.embargoDate).toLocaleDateString()}
          </StyledNormalText>
        ) : !currentFileUrl ? (
          <StyledButtonWithProgress
            isLoading={isLoadingFile}
            endIcon={!isLoadingFile && <CloudDownloadIcon />}
            data-testid="button-download-file"
            onClick={() => handleDownload(file.identifier)}>
            {t('download')}
          </StyledButtonWithProgress>
        ) : (
          <StyledButton
            variant="contained"
            color="primary"
            endIcon={<OpenInNewIcon />}
            data-testid="button-open-file"
            onClick={() => window.open(currentFileUrl)}>
            {t('open')}
          </StyledButton>
        )}
      </div>
      {selectedLicense && (
        <div>
          <img src={selectedLicense.image} alt={selectedLicense.identifier} />
          <Typography>
            {selectedLicense.link ? (
              <Link href={selectedLicense.link} target="_blank" rel="noopener noreferrer">
                {selectedLicense.label}
              </Link>
            ) : (
              selectedLicense.label
            )}
          </Typography>
          <StyledNormalText>{selectedLicense.description}</StyledNormalText>
        </div>
      )} */}
    </StyledFilesContent>
  );
};

export default PublicRegistrationFile;
