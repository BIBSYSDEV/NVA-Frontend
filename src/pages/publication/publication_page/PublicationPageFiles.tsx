import React, { FC } from 'react';
import styled from 'styled-components';
import DescriptionIcon from '@material-ui/icons/DescriptionOutlined';
import { File } from '../../../types/file.types';
import NormalText from '../../../components/NormalText';

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

const PublicationPageFiles: FC<PublicationPageFilesProps> = ({ files }) => (
  <>
    {files.map((file) => (
      <StyledFileIconWrapper key={file.identifier}>
        <StyledFileIcon />
        <NormalText>{file.name}</NormalText>
      </StyledFileIconWrapper>
    ))}
  </>
);

export default PublicationPageFiles;
