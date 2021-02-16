import React, { useState } from 'react';
import styled from 'styled-components';
import { CommonPreviewProps } from './PreviewFile';

interface ObjectProps {
  readonly isLoaded: boolean;
}

const StyledObject = styled.object<ObjectProps>`
  width: 100%;
  height: ${({ isLoaded }) => (isLoaded ? '25rem' : '0rem')};
`;

const PreviewPdf = ({ url, ...props }: CommonPreviewProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <StyledObject
      type="application/pdf"
      data={url}
      {...props}
      onLoad={() => {
        setIsLoaded(true);
      }}
      isLoaded={isLoaded}
    />
  );
};

export default PreviewPdf;
