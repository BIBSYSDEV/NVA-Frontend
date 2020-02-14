import React, { FC } from 'react';
import styled from 'styled-components';
import DescriptionIcon from '@material-ui/icons/DescriptionOutlined';
import { File } from '../../../types/file.types';

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
  return (
    <>
      {files.map((file, index) => (
        <StyledFileIconWrapper key={file.id}>
          <StyledFileIcon />
        </StyledFileIconWrapper>
      ))}
    </>
  );
};

export default PublicationPageFiles;
