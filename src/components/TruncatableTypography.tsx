import { TypographyProps, Typography, styled, Tooltip } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
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
  lines?: number; // Number of lines to show before truncation (Default: 3)
}

export const TruncatableTypography = ({ lines = 3, ...props }: TruncatableTypographyProps) => {
  const { t } = useTranslation('common');
  const typographyRef = useRef<HTMLElement | null>(null);
  const [lineClamp, setLineClamp] = useState<number | undefined>(lines);
  const [isTruncated, setIsTruncated] = useState(isOverflown(typographyRef.current));

  useEffect(() => {
    // Avoid bug where typographyRef did not get any value
    if (typographyRef.current) {
      setIsTruncated(isOverflown(typographyRef.current));
    }
  }, []);

  return (
    <Tooltip followCursor title={isTruncated && lineClamp !== undefined ? t<string>('click_to_show_all') : ''}>
      <StyledTruncatableTypography
        ref={typographyRef}
        lineClamp={lineClamp}
        isTruncated={isTruncated}
        onClick={() => isTruncated && setLineClamp(undefined)}
        {...props}
      />
    </Tooltip>
  );
};

// https://stackoverflow.com/a/9541579
const isOverflown = (element: HTMLElement | null) => {
  // Add 3 to clientHeight, otherwise some headers might give false positive
  return !!element && (element.scrollHeight > element.clientHeight + 3 || element.scrollWidth > element.clientWidth);
};
