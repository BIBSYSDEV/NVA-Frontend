import React, { FC, useState } from 'react';
import styled from 'styled-components';
import DescriptionIcon from '@material-ui/icons/DescriptionOutlined';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { File } from '../../../types/file.types';
import NormalText from '../../../components/NormalText';
import { downloadFile } from '../../../api/fileApi';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setNotification } from '../../../redux/actions/notificationActions';
import { NotificationVariant } from '../../../types/notification.types';
import ButtonWithProgress from '../../../components/ButtonWithProgress';

const StyledFileIcon = styled(DescriptionIcon)`
  width: 100px;
  height: 150px;
  border: 1px solid ${({ theme }) => theme.palette.text.primary};
  padding: 0.5rem;
`;

const StyledFileIconWrapper = styled.div`
  text-align: center;
`;

const StyledButtonWithProgress = styled(ButtonWithProgress)`
  margin: 1rem;
`;

interface PublicationPageFilesProps {
  files: File[];
}

const PublicationPageFiles: FC<PublicationPageFilesProps> = ({ files }) => {
  const { identifier } = useParams();
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const [isLoadingFile, setIsLoadingFile] = useState(false);

  const handleDownload = async (fileId: string) => {
    setIsLoadingFile(true);
    const file = await downloadFile(identifier, fileId);
    if (!file || file?.error) {
      dispatch(setNotification(file.error, NotificationVariant.Error));
    } else {
      window.open(file);
    }
    setIsLoadingFile(false);
  };

  return (
    <>
      {files.map((file) => (
        <StyledFileIconWrapper key={file.identifier}>
          <StyledFileIcon />
          <NormalText>{file.name}</NormalText>
          <StyledButtonWithProgress
            isLoading={isLoadingFile}
            endIcon={!isLoadingFile && <CloudDownloadIcon />}
            onClick={() => handleDownload(file.identifier)}>
            {t('download')}
          </StyledButtonWithProgress>
        </StyledFileIconWrapper>
      ))}
    </>
  );
};

export default PublicationPageFiles;
