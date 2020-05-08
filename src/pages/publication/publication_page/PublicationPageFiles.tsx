import React, { FC } from 'react';
import styled from 'styled-components';
import DescriptionIcon from '@material-ui/icons/DescriptionOutlined';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { File } from '../../../types/file.types';
import NormalText from '../../../components/NormalText';
import { Button } from '@material-ui/core';
import { downloadFile } from '../../../api/fileApi';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';

const StyledFileIcon = styled(DescriptionIcon)`
  width: 100px;
  height: 150px;
  border: 1px solid ${({ theme }) => theme.palette.text.primary};
  padding: 0.5rem;
`;

const StyledFileIconWrapper = styled.div`
  text-align: center;
`;

const StyledButton = styled(Button)`
  margin: 1rem;
`;

interface PublicationPageFilesProps {
  files: File[];
}

const PublicationPageFiles: FC<PublicationPageFilesProps> = ({ files }) => {
  const { identifier } = useParams();
  const { t } = useTranslation('common');
  const handleDownload = async (fileId: string) => {
    const file = await downloadFile(identifier, fileId);
    console.log('file', file);
  };
  return (
    <>
      {files.map((file) => (
        <StyledFileIconWrapper key={file.identifier}>
          <StyledFileIcon />
          <NormalText>{file.name}</NormalText>
          <StyledButton
            color="primary"
            variant="contained"
            endIcon={<CloudDownloadIcon />}
            onClick={() => handleDownload(file.identifier)}>
            {t('download')}
          </StyledButton>
        </StyledFileIconWrapper>
      ))}
    </>
  );
};

export default PublicationPageFiles;
