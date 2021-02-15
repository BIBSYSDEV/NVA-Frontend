import React from 'react';
import styled from 'styled-components';
import { CommonPreviewProps } from './PreviewFile';

const StyledObject = styled.object`
  width: 100%;
  height: 25rem;
`;

const PreviewPdf = ({ url, ...props }: CommonPreviewProps) => (
  <StyledObject type="application/pdf" data={url} {...props}>
    <embed type="application/pdf" src={url} />
  </StyledObject>
);

export default PreviewPdf;
