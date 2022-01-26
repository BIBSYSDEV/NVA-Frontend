import { TypographyProps, Typography } from '@mui/material';
import { useState } from 'react';

interface TruncateableTypographyProps extends TypographyProps {
  lines: number; // Number of lines to show before truncation
}

export const TruncateableTypography = ({ lines, ...props }: TruncateableTypographyProps) => {
  const [elementId] = useState(getRandomId);
  const [lineClamp, setLineClamp] = useState<number | null>(lines);

  const isTruncated = isOverflown(document.getElementById(elementId));

  return (
    // TODO: tooltip om man kan vise hele?
    <Typography
      id={elementId}
      sx={{
        overflow: 'hidden',
        display: '-webkit-box',
        // textOverflow: '"[...]"', // TODO?
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: lineClamp,
        lineClamp: lineClamp,
        cursor: isTruncated && lineClamp !== null ? 'pointer' : 'auto',
      }}
      onClick={() => isTruncated && setLineClamp(null)}
      {...props}
    />
  );
};

const getRandomId = () => Math.random().toString();

const isOverflown = (element: HTMLElement | null) =>
  element && (element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth);
