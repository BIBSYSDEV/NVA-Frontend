import { Tooltip, Typography, TypographyProps } from '@mui/material';

interface PublicationPointsTypographyProps extends TypographyProps {
  points: number;
}

export const PublicationPointsTypography = ({ points, ...typographyProps }: PublicationPointsTypographyProps) => {
  const oneDecimalString = points.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const fullString = points.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 4 });

  return (
    <Tooltip title={fullString}>
      <Typography {...typographyProps}>{oneDecimalString}</Typography>
    </Tooltip>
  );
};
