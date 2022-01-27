import { TypographyProps, Typography, styled } from '@mui/material';
import { useRef, useState } from 'react';

interface StyledTruncatableTypographyProps {
  lineClamp: number | undefined;
  isTruncated: boolean;
}

const StyledTruncatableTypography = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'lineClamp' && prop !== 'isTruncated',
})(({ lineClamp, isTruncated }: StyledTruncatableTypographyProps) => ({
  overflow: 'hidden',
  display: '-webkit-box',
  textOverflow: 'ellipsis',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: lineClamp,
  lineClamp: lineClamp,
  cursor: isTruncated && lineClamp !== undefined ? 'pointer' : 'auto',
}));

interface TruncatableTypographyProps extends TypographyProps {
  lines?: number; // Number of lines to show before truncation (Default: 3)
}

export const TruncatableTypography = ({ lines = 3, ...props }: TruncatableTypographyProps) => {
  const [lineClamp, setLineClamp] = useState<number | undefined>(lines);
  const typographyRef = useRef<HTMLElement | null>(null);
  const isTruncated = isOverflown(typographyRef.current);

  return (
    // TODO: tooltip om man kan vise hele?
    <StyledTruncatableTypography
      ref={typographyRef}
      lineClamp={lineClamp}
      isTruncated={isTruncated}
      onClick={() => isTruncated && setLineClamp(undefined)}
      {...props}
    />
  );
};

// https://stackoverflow.com/a/9541579
const isOverflown = (element: HTMLElement | null) => {
  // Add 3 to clientHeight, otherwise some headers might give false positive
  return !!element && (element.scrollHeight > element.clientHeight + 3 || element.scrollWidth > element.clientWidth);
};
