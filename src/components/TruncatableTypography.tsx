import { TypographyProps, Typography, styled } from '@mui/material';
import { useState } from 'react';

interface StyledTruncatableTypographyProps {
  lineClamp: number | undefined;
  isTruncated: boolean;
}

const StyledTruncatableTypography = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'lineClamp' && prop !== 'isTruncated',
})(({ lineClamp, isTruncated }: StyledTruncatableTypographyProps) => ({
  overflow: 'hidden',
  display: '-webkit-box',
  // textOverflow: '"[...]"', // TODO?
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: lineClamp,
  lineClamp: lineClamp,
  cursor: isTruncated && lineClamp !== undefined ? 'pointer' : 'auto',
}));

interface TruncatableTypographyProps extends TypographyProps {
  lines?: number; // Number of lines to show before truncation (Default: 3)
}

export const TruncatableTypography = ({ lines = 3, ...props }: TruncatableTypographyProps) => {
  const [elementId] = useState(getRandomId);
  const [lineClamp, setLineClamp] = useState<number | undefined>(lines);

  const isTruncated = isOverflown(document.getElementById(elementId));

  return (
    // TODO: tooltip om man kan vise hele?
    <StyledTruncatableTypography
      id={elementId}
      lineClamp={lineClamp}
      isTruncated={isTruncated}
      onClick={() => isTruncated && setLineClamp(undefined)}
      {...props}
    />
  );
};

const getRandomId = () => Math.random().toString();

const isOverflown = (element: HTMLElement | null) =>
  !!element && (element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth);
