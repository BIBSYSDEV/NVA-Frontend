import React, { useState } from 'react';
import styled from 'styled-components';
import { CommonPreviewProps } from './PreviewFile';
import PreviewUnavailable from './PreviewUnavailable';

interface ObjectProps {
  readonly isLoaded: boolean;
}

const StyledObject = styled.object<ObjectProps>`
  width: 100%;
  height: ${({ isLoaded }) => (isLoaded ? '25rem' : null)};
`;

const PreviewPdf = ({ url, ...props }: CommonPreviewProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <StyledObject type="application/pdf" data={url} {...props} onLoad={() => setIsLoaded(true)} isLoaded={isLoaded}>
      <PreviewUnavailable />
    </StyledObject>
  );
};

export default PreviewPdf;
