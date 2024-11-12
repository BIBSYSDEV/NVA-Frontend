import { Tooltip, Typography, TypographyProps, styled } from '@mui/material';
import { KeyboardEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { stringIncludesMathJax, typesetMathJax } from '../utils/mathJaxHelpers';

interface StyledTruncatableTypographyProps {
  lineClamp: number | undefined;
  isExpandable: boolean;
}

const StyledTruncatableTypography = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'lineClamp' && prop !== 'isExpandable',
})(({ lineClamp, isExpandable }: StyledTruncatableTypographyProps) => ({
  overflow: 'hidden',
  display: '-webkit-box',
  textOverflow: 'ellipsis',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: lineClamp,
  lineClamp: lineClamp,
  cursor: isExpandable ? 'pointer' : 'auto',
  wordBreak: 'break-word',
}));

interface TruncatableTypographyProps extends TypographyProps {
  lines?: number; // Number of lines to show before truncation
}

export const TruncatableTypography = ({ lines = 3, ...props }: TruncatableTypographyProps) => {
  const { t } = useTranslation();
  const [lineClamp, setLineClamp] = useState<number | undefined>(lines);
  const [isTruncated, setIsTruncated] = useState(false);

  const isExpandable = isTruncated && lineClamp !== undefined;

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      isTruncated && setLineClamp(undefined);
    }
  };

  useEffect(() => {
    if (props.children && stringIncludesMathJax(props.children.toString())) {
      typesetMathJax();
    }
  }, [props.children]);

  return (
    <Tooltip followCursor title={isExpandable ? t('common.click_to_show_all') : ''}>
      <StyledTruncatableTypography
        ref={(ref) => setIsTruncated(isOverflown(ref))}
        lineClamp={lineClamp}
        isExpandable={isExpandable}
        tabIndex={isExpandable ? 0 : -1}
        onClick={() => isTruncated && setLineClamp(undefined)}
        onKeyDown={handleKeyPress}
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
