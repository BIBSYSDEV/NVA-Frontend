import React from 'react';
import styled from 'styled-components';
import { CommonPreviewProps } from './PreviewFile';

const StyledImg = styled.img`
  max-width: 100%;
  max-height: 100%;
`;

interface PreviewImgProps extends CommonPreviewProps {
  imgAlt: string;
}

export const PreviewImg = ({ url, imgAlt, ...props }: PreviewImgProps) => (
  <StyledImg src={url} alt={imgAlt} {...props} />
);
