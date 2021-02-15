import React from 'react';
import styled from 'styled-components';
import { PreviewFileProps } from './PreviewFile';

const StyledImg = styled.img`
  max-width: 100%;
  max-height: 100%;
`;

const PreviewImg = ({ url, file, ...props }: PreviewFileProps) => <StyledImg src={url} alt={file.name} {...props} />;

export default PreviewImg;
