import React, { useState } from 'react';
import styled from 'styled-components';
import { CommonPreviewProps } from './PreviewFile';
import { PreviewUnavailable } from './PreviewUnavailable';

interface ObjectProps {
  readonly successfullyLoadedPdf: boolean;
}

const StyledObject = styled.object<ObjectProps>`
  width: 100%;
  height: ${({ successfullyLoadedPdf }) => (successfullyLoadedPdf ? '25rem' : null)};
`;

export const PreviewPdf = ({ url, ...props }: CommonPreviewProps) => {
  const [successfullyLoadedPdf, setSuccessfullyLoadedPdf] = useState(false);

  return (
    <StyledObject
      type="application/pdf"
      data={url}
      {...props}
      onLoad={() => setSuccessfullyLoadedPdf(true)}
      successfullyLoadedPdf={successfullyLoadedPdf}>
      <PreviewUnavailable />
    </StyledObject>
  );
};
