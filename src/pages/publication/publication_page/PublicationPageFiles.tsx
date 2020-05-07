import React, { FC } from 'react';
import styled from 'styled-components';
import DescriptionIcon from '@material-ui/icons/DescriptionOutlined';
import { File } from '../../../types/file.types';
import NormalText from '../../../components/NormalText';
import { Button } from '@material-ui/core';
import { downloadFile } from '../../../api/fileApi';
import { useParams } from 'react-router';

const StyledFileIcon = styled(DescriptionIcon)`
  width: 100px;
  height: 150px;
  border: 1px solid ${({ theme }) => theme.palette.text.primary};
  padding: 0.5rem;
`;

const StyledFileIconWrapper = styled.div`
  text-align: center;
`;

interface PublicationPageFilesProps {
  files: File[];
}

const PublicationPageFiles: FC<PublicationPageFilesProps> = ({ files }) => {
  const { identifier } = useParams();
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
          <Button onClick={() => handleDownload(file.identifier)}>Download</Button>
        </StyledFileIconWrapper>
      ))}
    </>
  );
};

export default PublicationPageFiles;
