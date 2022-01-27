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

// https://stackoverflow.com/questions/9333379/check-if-an-elements-content-is-overflowing
const isOverflown = (element: HTMLElement | null) => {
  return !!element && (element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth);
};
