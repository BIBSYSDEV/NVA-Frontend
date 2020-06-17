import React, { FC, useState } from 'react';
import styled from 'styled-components';
import DescriptionIcon from '@material-ui/icons/DescriptionOutlined';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import LockIcon from '@material-ui/icons/Lock';
import { File } from '../../../types/file.types';
import NormalText from '../../../components/NormalText';
import { downloadFile } from '../../../api/fileApi';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setNotification } from '../../../redux/actions/notificationActions';
import { NotificationVariant } from '../../../types/notification.types';
import ButtonWithProgress from '../../../components/ButtonWithProgress';
import { Button, Card } from '@material-ui/core';

const StyledFileIcon = styled(DescriptionIcon)`
  width: 100px;
  height: 150px;
  border: 1px solid ${({ theme }) => theme.palette.text.primary};
  padding: 0.5rem;
`;

const StyledButtonWithProgress = styled(ButtonWithProgress)`
  margin: 1rem;
`;

const StyledButton = styled(Button)`
  margin: 1rem;
`;

const StyledNormalText = styled(NormalText)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const StyledSidebarCard = styled(Card)`
  padding: 1rem 0.5rem;
  margin-bottom: 1rem;
  text-align: center;
`;

interface PublicPublicationFileProps {
  file: File;
}

const PublicPublicationFile: FC<PublicPublicationFileProps> = ({ file }) => {
  const { identifier } = useParams();
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

  return (
    <StyledSidebarCard>
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
          onClick={() => handleDownload(file.identifier)}>
          {t('download')}
        </StyledButtonWithProgress>
      ) : (
        <StyledButton
          variant="contained"
          color="primary"
          endIcon={<OpenInNewIcon />}
          onClick={() => window.open(currentFileUrl)}>
          {t('open')}
        </StyledButton>
      )}
    </StyledSidebarCard>
  );
};

export default PublicPublicationFile;
