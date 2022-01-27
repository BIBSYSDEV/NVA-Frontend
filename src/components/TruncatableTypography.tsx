import { TypographyProps, Typography, styled, Tooltip } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

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
  lines?: number; // Number of lines to show before truncation
}

export const TruncatableTypography = ({ lines = 3, ...props }: TruncatableTypographyProps) => {
  const { t } = useTranslation('common');
  const [lineClamp, setLineClamp] = useState<number | undefined>(lines);
  const [isTruncated, setIsTruncated] = useState(false);

  return (
    <Tooltip followCursor title={isTruncated && lineClamp !== undefined ? t<string>('click_to_show_all') : ''}>
      <StyledTruncatableTypography
        ref={(ref) => setIsTruncated(isOverflown(ref))}
        lineClamp={lineClamp}
        isTruncated={isTruncated}
        onClick={() => isTruncated && setLineClamp(undefined)}
        {...props}
      />
    </Tooltip>
  );
};

// Find out if DOM element is overflowing. Inspired by: https://stackoverflow.com/a/9541579
const heightOffset = 4; // Add a small offset to clientHeight. Otherwise, some h-tags might give false positives.
const isOverflown = (element: HTMLSpanElement | null) =>
  !!element &&
  (element.scrollHeight > element.clientHeight + heightOffset || element.scrollWidth > element.clientWidth);
